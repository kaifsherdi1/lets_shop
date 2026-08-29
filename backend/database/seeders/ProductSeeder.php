<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $distributorRole = Role::where('slug', 'distributor')->first();
        if (! $distributorRole) {
            $this->command->error('Distributor role not found. Run RoleSeeder first.');

            return;
        }

        $distributor = User::where('role_id', $distributorRole->id)->first()
            ?? User::create([
                'name' => 'Demo Distributor',
                'full_name' => 'Demo Distributor',
                'email' => 'distributor@letsshop.com',
                'password' => bcrypt('password'),
                'phone' => '1234567890',
                'role_id' => $distributorRole->id,
                'status' => 'active',
            ]);

        $catalog = json_decode(File::get(__DIR__ . '/data/products.json'), true) ?: [];
        $categories = Category::pluck('id', 'slug');
        $seeded = 0;

        foreach ($catalog as $p) {
            $categoryId = $categories[$p['category']] ?? null;
            if (! $categoryId) {
                continue;
            }

            Product::updateOrCreate(
                ['slug' => Str::slug($p['name'])],
                [
                    'name' => $p['name'],
                    'description' => $p['description'],
                    'category_id' => $categoryId,
                    'distributor_id' => $distributor->id,
                    'sku' => strtoupper(Str::slug($p['name'])) . '-' . str_pad((string) (++$seeded), 3, '0', STR_PAD_LEFT),
                    'price_aed' => $p['price_aed'],
                    'price_inr' => $p['price_inr'],
                    'distributor_price_aed' => $p['distributor_price_aed'],
                    'distributor_price_inr' => $p['distributor_price_inr'],
                    'commission_amount_aed' => $p['commission_amount_aed'],
                    'commission_amount_inr' => $p['commission_amount_inr'],
                    'stock_quantity' => $p['stock_quantity'],
                    'status' => 'active',
                    'images' => [$p['image']],
                ]
            );
        }

        $this->command->info("ProductSeeder: {$seeded} products seeded with local images.");
    }
}
