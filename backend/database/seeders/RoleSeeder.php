<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full system access and control'
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Manage operations and oversee staff'
            ],
            [
                'name' => 'Accountant',
                'slug' => 'accountant',
                'description' => 'Manage finances, commissions, and withdrawals'
            ],
            [
                'name' => 'HR',
                'slug' => 'hr',
                'description' => 'Manage human resources and staff'
            ],
            [
                'name' => 'Distributor',
                'slug' => 'distributor',
                'description' => 'Upload and sell products, earn commissions'
            ],
            [
                'name' => 'Agent',
                'slug' => 'agent',
                'description' => 'Sell products and earn commissions'
            ],
            [
                'name' => 'Customer',
                'slug' => 'customer',
                'description' => 'Browse and purchase products'
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
