#!/usr/bin/env bash
# PostGIS-free migration. Requires: supabase login (or use apply-migration.mjs)
# Usage: ./scripts/run-migration.sh tnwaqyfshomlyjgujdzu
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

cd "$(dirname "$0")/.."

if ! supabase projects list &>/dev/null; then
  echo "Run: supabase login"
  exit 1
fi

REF="${1:-}"
if [[ -z "$REF" ]]; then
  echo "Projects:"
  supabase projects list
  echo "Usage: $0 <project-ref>"
  exit 1
fi

supabase link --project-ref "$REF"
supabase db execute -f supabase/migrations/001_initial_schema.sql
echo "Migration applied to $REF"
