<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // User Management
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],

            // Product Management
            ['name' => 'View Products', 'slug' => 'products.view', 'module' => 'products'],
            ['name' => 'Create Products', 'slug' => 'products.create', 'module' => 'products'],
            ['name' => 'Edit Products', 'slug' => 'products.edit', 'module' => 'products'],
            ['name' => 'Delete Products', 'slug' => 'products.delete', 'module' => 'products'],

            // Order Management
            ['name' => 'View Orders', 'slug' => 'orders.view', 'module' => 'orders'],
            ['name' => 'Edit Orders', 'slug' => 'orders.edit', 'module' => 'orders'],
            ['name' => 'Cancel Orders', 'slug' => 'orders.cancel', 'module' => 'orders'],

            // Commission Management
            ['name' => 'View Commissions', 'slug' => 'commissions.view', 'module' => 'commissions'],
            ['name' => 'Approve Commissions', 'slug' => 'commissions.approve', 'module' => 'commissions'],

            // Wallet Management
            ['name' => 'View Wallets', 'slug' => 'wallets.view', 'module' => 'wallets'],
            ['name' => 'Approve Withdrawals', 'slug' => 'withdrawals.approve', 'module' => 'wallets'],

            // Reports
            ['name' => 'View Reports', 'slug' => 'reports.view', 'module' => 'reports'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
