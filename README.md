# LetsShop - Enterprise Multi-Vendor Ecommerce Platform

A production-ready, scalable multi-vendor ecommerce platform built with Laravel (Backend) and React (Frontend).

## 🚀 Features

### Backend (Laravel 11)
- **35+ RESTful API Endpoints**
- **Dual Currency Support** (INR ₹ / AED د.إ)
- **Role-Based Access Control** (7 roles: Admin, Manager, Accountant, HR, Distributor, Agent, Customer)
- **Commission Management** with manual approval workflow
- **Wallet System** with withdrawal requests
- **Complete Order Lifecycle** (Pending → Processing → Shipped → Delivered)
- **Stock Management** with automatic reduction/restoration
- **Laravel Sanctum Authentication**

### Frontend
- **User Application** (React + Vite)
- **Admin Dashboard** (React + Vite)

## 📊 System Architecture

```
LetsShop/
├── backend/          # Laravel 11 API
├── frontend-user/    # Customer-facing React app
└── frontend-admin/   # Admin dashboard React app
```

## 🛠️ Tech Stack

**Backend:**
- Laravel 11.x
- MySQL Database
- Laravel Sanctum (API Authentication)
- RESTful API Architecture

**Frontend:**
- React 18
- Vite
- TypeScript

## 📦 Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_DATABASE=lets_shop
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed roles and categories
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=CategorySeeder

# Start development server
php artisan serve
```

### Frontend Setup

**User Application:**
```bash
cd frontend-user
npm install
npm run dev
```

**Admin Dashboard:**
```bash
cd frontend-admin
npm install
npm run dev
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (Distributor)
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Cart & Orders
- `GET /api/cart` - View cart
- `POST /api/cart/items` - Add to cart
- `POST /api/orders` - Place order
- `GET /api/orders` - List orders

### Commission & Wallet
- `GET /api/my-commissions` - View commissions
- `POST /api/commissions/{id}/approve` - Approve commission (Admin)
- `GET /api/wallet` - View wallet balance
- `POST /api/wallet/withdraw` - Request withdrawal

[See full API documentation in `/backend/routes/api.php`]

## 👥 User Roles

1. **Admin** - Full system access
2. **Manager** - Operations management
3. **Accountant** - Finance & commission approval
4. **HR** - Staff management
5. **Distributor** - Upload products, earn commissions
6. **Agent** - Sell products, earn commissions
7. **Customer** - Browse and purchase

## 💰 Commission Workflow

```
Order Placed → Commission Calculated (Pending)
→ Admin/Accountant Reviews → Approves
→ Amount Credited to Wallet → Status: Paid
→ Distributor Requests Withdrawal
→ Admin Approves → Funds Transferred
```

## 💱 Multi-Currency

- Products have separate pricing for INR and AED
- Users select currency at checkout
- Commissions calculated in order currency
- Wallet supports both currencies

## 🗄️ Database Schema

**21 Tables:**
- Authentication: users, roles, permissions, addresses
- Products: categories, products
- Shopping: carts, cart_items
- Orders: orders, order_items, payments
- Finance: wallets, transactions, commissions, withdrawal_requests

## 🔒 Security

- ✅ Sanctum token authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ Authorization checks
- ✅ Soft deletes
- ✅ Database transactions

## 📝 Environment Variables

Create `.env` files in backend and frontend directories:

**Backend (.env):**
```env
APP_NAME=LetsShop
APP_URL=http://localhost:8000
DB_DATABASE=lets_shop
DB_USERNAME=root
DB_PASSWORD=
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Backend (VPS)
1. Upload code to server
2. Configure `.env` with production settings
3. Run migrations: `php artisan migrate --force`
4. Set up web server (Nginx/Apache)
5. Configure SSL certificate

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting
3. Configure environment variables

## 📈 Current Status

✅ **Backend Complete** - 35+ API endpoints  
✅ **Database Schema** - 21 tables  
✅ **Authentication** - Sanctum tokens  
✅ **Product Management** - CRUD operations  
✅ **Cart & Orders** - Full lifecycle  
✅ **Commission System** - Approval workflow  
✅ **Wallet Management** - Withdrawals  
⏳ **Frontend** - Structure ready  

## 🤝 Contributing

This is a private enterprise project.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Developer

**Kaif Sherdi**  
Email: kaifsherdi1@gmail.com

---

**Built with ❤️ for enterprise-scale ecommerce**
