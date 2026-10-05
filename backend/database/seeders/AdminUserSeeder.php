<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Ensures a first admin account exists. Credentials come from the environment
 * (ADMIN_EMAIL / ADMIN_PASSWORD) so they are never committed. Safe to run on
 * every deploy — it only creates the account when that email is missing.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@letsshop.com');
        $password = env('ADMIN_PASSWORD');

        if (User::where('email', $email)->exists()) {
            $this->command?->info("Admin {$email} already exists — skipping.");

            return;
        }

        // Never create an admin with a password anyone can read in this repo.
        $knownDefaults = ['ChangeMe!2026', 'change-this-now', 'password'];
        if (! app()->environment('local', 'testing') && (! $password || in_array($password, $knownDefaults, true) || strlen($password) < 12)) {
            $this->command?->error('ADMIN_PASSWORD is missing, too short (< 12 chars) or a documented default — admin account NOT created. Set a strong ADMIN_PASSWORD and redeploy.');

            return;
        }
        $password = $password ?: 'ChangeMe!2026'; // local development only

        $role = Role::where('slug', 'admin')->first();
        if (! $role) {
            $this->command?->error('Admin role not found. Run RoleSeeder first.');

            return;
        }

        $user = User::create([
            'name' => 'Administrator',
            'full_name' => 'Administrator',
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $role->id,
            'status' => 'active',
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();

        $this->command?->info("Admin account created: {$email}");
    }
}
