#!/usr/bin/env node
/**
 * Apply Orpola SQL migration without PostGIS.
 *
 * Option 1 (recommended): Supabase account access token
 *   1. https://supabase.com/dashboard/account/tokens → Generate token
 *   2. export SUPABASE_ACCESS_TOKEN=sbp_...
 *   3. node scripts/apply-migration.mjs
 *
 * Option 2: Database password (Settings → Database → Connection string)
 *   export SUPABASE_DB_PASSWORD=your-db-password
 *   node scripts/apply-migration.mjs
 *
 * Option 3: Paste SQL in Supabase SQL Editor (no script needed)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PROJECT_REF = "tnwaqyfshomlyjgujdzu";
const MIGRATION = resolve(ROOT, "supabase/migrations/001_initial_schema.sql");

function loadEnvLocal() {
  const path = resolve(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

async function applyViaManagementApi(sql) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) return false;

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  const text = await res.text();
  if (!res.ok) {
    console.error("Management API error:", res.status, text);
    return false;
  }
  console.log("Migration applied via Supabase Management API.");
  if (text && text !== "[]") console.log(text);
  return true;
}

async function applyViaPostgres(sql) {
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) return false;

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error("Install pg: npm install pg");
    return false;
  }

  const host = process.env.SUPABASE_DB_HOST || "aws-0-eu-central-1.pooler.supabase.com";
  const connectionString =
    process.env.DATABASE_URL ||
    `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(password)}@${host}:6543/postgres`;

  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log("Migration applied via direct Postgres connection.");
    return true;
  } finally {
    await client.end();
  }
}

async function verifyAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const res = await fetch(`${url}/rest/v1/clubs?select=slug,name&limit=10`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  console.log(`\nVerify GET /clubs → HTTP ${res.status}`);
  console.log(body.slice(0, 500));
}

async function main() {
  loadEnvLocal();
  const sql = readFileSync(MIGRATION, "utf8");

  if (await applyViaManagementApi(sql)) {
    await verifyAnon();
    return;
  }
  if (await applyViaPostgres(sql)) {
    await verifyAnon();
    return;
  }

  console.log(`
Could not apply migration automatically.

Set ONE of:
  export SUPABASE_ACCESS_TOKEN=sbp_...   # dashboard → Account → Access Tokens
  export SUPABASE_DB_PASSWORD=...        # project → Settings → Database

Then run: node scripts/apply-migration.mjs

Or copy-paste this file into Supabase SQL Editor:
  ${MIGRATION}
`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
