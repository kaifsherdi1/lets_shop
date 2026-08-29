# LetsShop — Deployment Guide

Three pieces:

| Piece | Where | URL |
|---|---|---|
| **API** (Laravel) | Railway | `https://<service>.up.railway.app` |
| **Storefront** (`frontend-user`) | Vercel | https://lets-shop-gold.vercel.app |
| **Admin dashboard** (`frontend-admin`) | Vercel (new project) | you create this |

Everything below is committed and ready — you only need to click through Railway/Vercel and set environment variables.

---

## 1 · Backend API on Railway

### 1.1 Create the service
1. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → pick `kaifsherdi1/lets_shop`.
2. In the service **Settings → Root Directory** set `backend`.
3. Railway auto-detects Nixpacks + the committed `backend/railway.json` / `backend/nixpacks.toml` (PHP-only build, then `migrate → seed → serve`).

### 1.2 Add a database
1. In the project: **+ New → Database → MySQL**.
2. Open the **backend service → Variables** and add the ones below.

### 1.3 Environment variables (backend service → Variables)

```
APP_NAME=LetsShop
APP_ENV=production
APP_DEBUG=false
APP_KEY=            # see 1.4
APP_URL=https://<service>.up.railway.app

LOG_CHANNEL=stderr
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_URL=${{ MySQL.MYSQL_URL }}          # <- reference the MySQL plugin

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=sync

SANCTUM_TOKEN_EXPIRY=10080

# First admin account — created automatically on first deploy
ADMIN_EMAIL=you@yourdomain.com
ADMIN_PASSWORD=<a-strong-password>

# CORS — the two front-end origins
FRONTEND_USER_URL=https://lets-shop-gold.vercel.app
FRONTEND_ADMIN_URL=https://<your-admin>.vercel.app   # fill after step 3

# Email (optional — leave as 'log' to skip, OTP codes then only appear in the Railway logs)
MAIL_MAILER=log
```

> `${{ MySQL.MYSQL_URL }}` is Railway's variable-reference syntax — type it exactly; it resolves to the MySQL connection string and Laravel's `config/database.php` reads it via `DB_URL`.

### 1.4 Generate APP_KEY
Locally, in `backend/`:
```bash
php artisan key:generate --show
```
Copy the `base64:...` value into the `APP_KEY` variable on Railway. (Or, after the first deploy, open the Railway service **Shell** and run `php artisan key:generate --force`, then redeploy.)

### 1.5 Deploy
Railway builds and runs the start command:
```
php artisan migrate --force && php artisan db:seed --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=$PORT
```
- Migrations + seeders are **idempotent** — safe on every deploy.
- The seed loads 5 categories, 32 demo products (images served from `backend/public/img/`), and your admin account.
- Health check: `GET /up` must return 200 (Railway waits up to 180s).

### 1.6 Verify
```bash
curl https://<service>.up.railway.app/up
curl https://<service>.up.railway.app/api/products?per_page=1
```

---

## 2 · Storefront (already on Vercel)

The storefront is at **https://lets-shop-gold.vercel.app**. Point it at the API:

1. Vercel → the `lets-shop-gold` project → **Settings → Environment Variables**.
2. Add (Production + Preview):
   ```
   VITE_API_URL = https://<service>.up.railway.app/api
   ```
   *(include the trailing `/api`)*
3. **Deployments → ⋯ → Redeploy** (Vite bakes env vars at build time, so a redeploy is required).
4. Project settings should be: Framework **Vite**, Root Directory **`frontend-user`**, Build `npm run build`, Output `dist`. `frontend-user/vercel.json` already handles SPA routing.

---

## 3 · Admin dashboard on Vercel (new project)

1. Vercel → **Add New → Project** → import the same repo.
2. **Root Directory: `frontend-admin`**, Framework preset **Vite**.
3. **Environment Variables:**
   ```
   VITE_API_URL = https://<service>.up.railway.app/api
   ```
4. Deploy. Note the URL (e.g. `https://letshop-admin.vercel.app`).
5. Go back to **Railway → backend → Variables** and set `FRONTEND_ADMIN_URL` to that URL, then redeploy the backend (CORS is baked into the config cache).

`frontend-admin/vercel.json` already handles SPA routing; `index.html` sets `noindex`.

---

## 4 · First login

- **Admin dashboard**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set on Railway.
- **Storefront**: register a new account. With `MAIL_MAILER=log` the OTP is printed to the Railway logs (**Deployments → View Logs**); set real Resend SMTP creds to receive it by email instead.

---

## Notes / limitations of this setup

- **`php artisan serve`** is used as the web server — fine for a demo/portfolio on Railway's hobby tier, not for real traffic. For production, switch to FrankenPHP/Octane or nginx + php-fpm and run the queue worker + scheduler as separate Railway services.
- **Uploaded** product images (added through the admin) land on Railway's ephemeral disk and disappear on redeploy. The 32 seeded images are committed to the repo so they always survive. For persistent uploads, wire `FILESYSTEM_DISK=s3` to Cloudflare R2 / Supabase Storage.
- **Payments**: only Cash-on-Delivery and bank transfer are wired. The Stripe integration is still pending (see `.claude/plans`).
- Changing a CORS or DB env var on Railway requires a **redeploy** because `config:cache` runs at boot.
