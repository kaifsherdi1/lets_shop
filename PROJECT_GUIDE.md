# LetsShop - Project Documentation

## 📌 Project Overview
**LetsShop** is a production-ready, enterprise-scale multi-vendor e-commerce platform. It is designed to support a complex ecosystem of vendors, agents, and customers with advanced features like multi-currency support, automated commissions, and a robust role-based access control (RBAC) system.

---

## 👥 User Roles & Permissions

The system implements a granular Role-Based Access Control (RBAC) system with 7 distinct roles:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Admin** | System Superuser | Full system access, user management, global stats, system configurations. |
| **Manager** | Operations Lead | Manage categories, products, and oversee order processing. |
| **Accountant** | Finance Manager | Approve/Reject commissions, process withdrawal requests, manage financial logs. |
| **HR** | Staff Management | Manage internal staff and role assignments. |
| **Distributor** | Product Vendor | Upload and manage products, track sales, earn commissions, request withdrawals. |
| **Agent** | Sales Representative | Sell products, track performance, earn commissions, request withdrawals. |
| **Customer** | End User | Browse products, manage cart, place orders, track order history. |

---

## 🛠️ Core Functionality & Features

### 1. Product & Category Management
- **Multi-Category Architecture**: Hierarchical categories for better product organization.
- **Product CRUD**: Distributors and Admins can create, update, and delete products.
- **Inventory Tracking**: Automatic stock reduction on purchase and restoration on cancellation.
- **Concurrency Safety**: Cache locks prevent stock overselling under load.

### 2. Multi-Currency Support
- **Dual Currency Native Support**: Full integration for **INR (₹)** and **AED (د.إ)**.
- **Dynamic Pricing**: Products can have separate pricing for different regions.
- **Wallet Compatibility**: The wallet system tracks balances in the respective currencies.

### 3. Order Lifecycle
- **Complete Workflow**: Orders move through states: `Pending` → `Processing` → `Shipped` → `Delivered`.
- **Order Tracking**: Customers can view their history and real-time status of orders.
- **Automation**: Order placement automatically triggers commission calculations for vendors.

### 4. Financial Ecosystem (Commission & Wallet)
- **Automated Commission**: System calculates commissions for Distributors and Agents based on predefined rules.
- **Approval Workflow**: Commissions must be reviewed and approved by an Admin/Accountant before being credited to the wallet.
- **Withdrawal System**: Users can request funds from their wallet, which are processed following admin approval.

### 5. Security & Authentication
- **OTP Verification**: Secure login and registration using One-Time Passcodes.
- **Sanctum Authentication**: Token-based API security.
- **Protected Routes**: Strict separation of user facets (Admin vs. Customer).
- **Rate Limiting**: Auth routes are throttled to 10 requests/minute per IP (brute-force protection).
- **CORS**: Configured to only allow the specific frontend Vercel URLs.

### 6. User Profile Management (NEW)
- Users can update their display name, full name, and phone number.
- Secure password change with current-password verification.
- All other sessions revoked on password change for security.

### 7. Distributor/Agent Portal (NEW)
- Dedicated sidebar experience for Distributor/Agent roles.
- Personal dashboard: wallet balance, total earnings, pending commissions, 6-month chart.
- View own products, commissions, and wallet withdrawals.

---

## 🛣️ Routing Structure

### 🌐 Frontend - User Application (Storefront)
| Path | Page | Access |
| :--- | :--- | :--- |
| `/` | Home Page | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/products` | Product Listing | Public |
| `/products/:id` | Product Details | Public |
| `/categories/:slug` | Category Listing | Public |
| `/cart` | Shopping Cart | Customer (Protected) |
| `/checkout` | Checkout Process | Customer (Protected) |
| `/orders` | Order History | Customer (Protected) |
| `/profile` | User Profile Management | Customer (Protected) |
| `/about` | About Us | Public |
| `/contact` | Contact Page | Public |

### 🔐 Frontend - Admin Dashboard
| Path | Page | Access |
| :--- | :--- | :--- |
| `/login` | Admin Login | Public |
| `/` | Dashboard Stats (Real Data Charts) | Admin/Manager/Accountant |
| `/products` | Product Management | Admin/Distributor |
| `/categories` | Category Management | Admin/Manager |
| `/orders` | Order Management | Admin/Manager |
| `/commissions` | Commission Approvals | Admin/Accountant |
| `/withdrawals` | Withdrawal Requests | Admin/Accountant |
| `/users` | User Management | Admin |
| `/portal` | My Earnings Dashboard | Distributor/Agent |

### 🚀 Backend API Endpoints (Highlights)
- **Auth**: OTP-based authentication (`/api/auth/verify-otp`) — rate limited.
- **Profile**: User profile update (`/api/profile`) — GET + PUT + change-password.
- **Products**: Full CRUD with regional pricing support.
- **Finance**: Commission approval workflow and wallet withdrawals.
- **Admin**: Statistical dashboards with real monthly data (`/api/admin/monthly-stats`).
- **Portal**: Distributor/Agent scoped stats (`/api/portal/stats`).

---

## 🏗️ Technical Stack
- **Backend**: Laravel 12, MySQL, PHP 8.2+.
- **Frontend**: React 18, Vite, Tailwind CSS.
- **Routing**: React Router DOM.
- **State/Auth**: Context API & Laravel Sanctum.
- **Queue**: Database queue for async commission processing.
- **Email**: Resend.com SMTP for OTP delivery.

---

## 🚀 Deployment Stack (Free)
| Service | Purpose |
| :--- | :--- |
| Railway.app | Laravel backend + MySQL + queue worker |
| Vercel | User storefront (React) |
| Vercel | Admin dashboard (React) |
| Resend.com | Transactional email (3K/month free) |

See the `DEPLOYMENT_CHECKLIST.md` for step-by-step deployment instructions.
