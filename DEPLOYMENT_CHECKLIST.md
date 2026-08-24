# 🚀 LetsShop — Deployment Checklist

> Deploy backend on Railway + both frontends on Vercel — **$0/month**

---

## ⚠️ ONE MANUAL STEP REQUIRED BEFORE COMMIT

> **DELETE `backend/create_admin.php`** — This raw PHP script is a security vulnerability. Anyone who finds the URL can create an admin account. Must be removed before deploying.

---

## 🌐 Free Hosting Stack

| Layer | Service | Cost |
|:---|:---|:---:|
| Laravel API + MySQL | Railway.app | Free |
| User Storefront (React) | Vercel | Free |
| Admin Dashboard (React) | Vercel | Free |
| Email (OTP + Orders) | Resend.com | Free (3K/mo) |

---

## 📋 DEPLOYMENT STEPS

### Step 1 — Get Resend.com API Key
1. Go to [resend.com](https://resend.com) → Sign up free
2. Create an API key → copy it (starts with `re_`)

### Step 2 — Deploy Backend to Railway
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Add MySQL: **+ New → Database → MySQL**
4. In **Variables** tab, set all env vars from `backend/.env.example`
5. Your Railway backend URL: `https://your-project.up.railway.app`

### Step 3 — Deploy User Storefront to Vercel
1. [vercel.com](https://vercel.com) → New Project → import repo
2. Root Directory: `frontend-user` | Framework Preset: **Vite**
3. Environment Variable: `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`
4. Deploy

### Step 4 — Deploy Admin Dashboard to Vercel
1. Vercel → New Project → same repo
2. Root Directory: `frontend-admin` | Framework Preset: **Vite**
3. Environment Variable: `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`
4. Deploy

### Step 5 — Update CORS with Live Vercel URLs
In Railway → Variables tab, update:
```env
FRONTEND_USER_URL=https://your-user-app.vercel.app
FRONTEND_ADMIN_URL=https://your-admin-app.vercel.app
```

### Step 6 — Create Admin User
In Railway → Shell tab, run:
```bash
php artisan tinker
```
```php
$role = App\Models\Role::where('slug','admin')->first();
App\Models\User::create([
  'name'              => 'admin',
  'full_name'         => 'Super Admin',
  'email'             => 'admin@letshop.com',
  'password'          => bcrypt('Admin@123'),
  'role_id'           => $role->id,
  'status'            => 'active',
  'email_verified_at' => now(),
]);
```

---

## ✅ Final Verification Tests

- [ ] Register → OTP arrives in real email inbox
- [ ] Login → home page loads with products
- [ ] Add to cart → checkout (COD) → order placed
- [ ] Admin login → stats cards show real numbers
- [ ] Dashboard charts show **real data** (no "Sample data" badge)
- [ ] Update order status in admin panel
- [ ] Distributor login → `/portal` shows personal earnings
- [ ] Commission approve → wallet balance updates
- [ ] User Profile → update name/phone → save works
- [ ] Change password → other sessions logged out
