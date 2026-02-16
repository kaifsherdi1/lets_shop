# LetsShop - Quick Start Guide

## 🚀 Running the Application

### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan serve --port=8000
```

### 2. Frontend Setup
```bash
cd frontend-user
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## 📝 Test Accounts

### Register New Account
1. Go to http://localhost:5173/register
2. Fill in the form
3. Select role: Customer, Distributor, or Agent
4. Click Register

### Test Flow
1. **Browse Products**: Visit homepage or products page
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click cart icon in header
4. **Checkout**: Click "Proceed to Checkout"
5. **Place Order**: Fill address, select currency, choose payment method
6. **View Orders**: Click "Orders" in navigation

## 🎯 Key Features

- ✅ User authentication (login/register)
- ✅ Product browsing with search & filters
- ✅ Shopping cart management
- ✅ Checkout with address form
- ✅ Order placement & tracking
- ✅ Dual currency support (INR/AED)
- ✅ Commission system for distributors
- ✅ Wallet & withdrawal management

## 📦 What's Included

**Backend:**
- 35+ API endpoints
- 21 database tables
- Complete authentication
- Product & category management
- Cart & checkout
- Commission approval
- Wallet management

**Frontend:**
- 8 pages (Login, Register, Home, Products, Product Detail, Cart, Checkout, Orders)
- React Router navigation
- Axios API integration
- Context-based state management
- Responsive design

## 🔧 Environment Variables

**Backend (.env):**
```env
DB_DATABASE=lets_shop
DB_USERNAME=root
DB_PASSWORD=
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
```

## 📚 Documentation

See `walkthrough.md` for complete documentation of all features, endpoints, and architecture.

---

**Ready to use!** 🎉
