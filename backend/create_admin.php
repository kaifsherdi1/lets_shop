<?php

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

$role = Role::where('slug', 'admin')->first();

if (!$role) {
  echo "ERROR: Admin role not found!\n";
  exit(1);
}

// Check if admin already exists
$existing = User::where('email', 'admin@letsshop.com')->first();
if ($existing) {
  echo "Admin already exists: admin@letsshop.com\n";
  echo "Role: " . ($existing->role->slug ?? 'unknown') . "\n";
  exit(0);
}

$user = User::create([
  'name' => 'Super Admin',
  'full_name' => 'Super Admin',
  'email' => 'admin@letsshop.com',
  'password' => Hash::make('admin123456'),
  'role_id' => $role->id,
  'status' => 'active',
  'email_verified_at' => now(),
]);

echo "Admin user created successfully!\n";
echo "Email: admin@letsshop.com\n";
echo "Password: admin123456\n";
