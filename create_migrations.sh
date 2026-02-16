#!/bin/bash

# LetsShop Database Migrations Creation Script

cd backend

# Core Tables
php artisan make:migration create_roles_table
php artisan make:migration create_permissions_table  
php artisan make:migration create_role_permission_table
php artisan make:migration add_role_to_users_table
php artisan make:migration create_addresses_table

# Product Tables
php artisan make:migration create_categories_table
php artisan make:migration create_products_table

# Cart Tables
php artisan make:migration create_carts_table
php artisan make:migration create_cart_items_table

# Order Tables
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_payments_table

# Wallet & Commission Tables
php artisan make:migration create_wallets_table
php artisan make:migration create_transactions_table
php artisan make:migration create_commissions_table
php artisan make:migration create_withdrawal_requests_table

# Auth Tables
php artisan make:migration create_otp_verifications_table
php artisan make:migration create_login_sessions_table

echo "All migrations created successfully!"
