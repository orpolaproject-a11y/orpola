# Fix orpola.com pointing to GoDaddy instead of Vercel

## Problem

`orpola.com` / `www.orpola.com` show a **GoDaddy Website Builder** page, not your Next.js app.  
Your Supabase data is fine — the domain DNS still points to GoDaddy.

## Check (Terminal)

```bash
dig +short orpola.com NS
```

**Wrong (GoDaddy):** `ns07.domaincontrol.com` / `ns08.domaincontrol.com`  
**Correct (Vercel):** `ns1.vercel-dns.com` / `ns2.vercel-dns.com`

## Fix in GoDaddy

1. [GoDaddy](https://dcc.godaddy.com) → **My Products** → **orpola.com** → **DNS** or **Manage**
2. **Nameservers** → **Change** → **Enter my own nameservers**
3. Set:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Save.
5. Remove **Domain Forwarding** (if enabled).
6. Disconnect / unpublish **Website Builder** for this domain (if connected).

## Verify in Vercel

1. [Vercel](https://vercel.com) → project **orpola** → **Settings** → **Domains**
2. Wait until `orpola.com` and `www.orpola.com` show **Valid** (can take 1–48 hours).
3. Click **Refresh** on each domain.

## After DNS propagates

- https://www.orpola.com/clubs should show your Orpola app (3 clubs from Supabase).

Test:

```bash
dig +short orpola.com NS   # should be vercel-dns.com
```
