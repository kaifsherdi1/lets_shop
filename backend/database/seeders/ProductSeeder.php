<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure we have a distributor user
        $distributorRole = Role::where('slug', 'distributor')->first();
        if (!$distributorRole) {
            $this->command->error('Distributor role not found. Please run RoleSeeder first.');
            return;
        }

        $distributor = User::where('role_id', $distributorRole->id)->first();
        if (!$distributor) {
            $distributor = User::create([
                'name' => 'Demo Distributor',
                'full_name' => 'Demo Distributor',
                'email' => 'distributor@letsshop.com',
                'password' => bcrypt('password'),
                'phone' => '1234567890',
                'role_id' => $distributorRole->id,
                'status' => 'active',
            ]);
        }

        // 2. Define Products Data
        $categoryData = [
            'electronics' => [
                ['name' => 'Premium Wireless Headphones', 'price_aed' => 499, 'price_inr' => 11000, 'desc' => 'High-fidelity audio with active noise cancellation and 40-hour battery life.', 'image' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Smart Watch Series X', 'price_aed' => 899, 'price_inr' => 20000, 'desc' => 'Track your health, receive notifications, and stay connected on the go.', 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Ultra Slim 14" Laptop', 'price_aed' => 2499, 'price_inr' => 55000, 'desc' => 'Powerful performance in a lightweight design. Perfect for professionals.', 'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Mechanical Gaming Keyboard', 'price_aed' => 299, 'price_inr' => 6500, 'desc' => 'Customizable RGB lighting and responsive mechanical switches for gamers.', 'image' => 'https://images.unsplash.com/photo-1618384881928-d207128bd00d?auto=format&fit=crop&q=80&w=600'],
                ['name' => '4K Mirrorless Camera', 'price_aed' => 3200, 'price_inr' => 72000, 'desc' => 'Professional-grade photography and 4K video recording in a compact body.', 'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Bluetooth Portable Speaker', 'price_aed' => 199, 'price_inr' => 4500, 'desc' => 'Waterproof, rugged design with deep bass for outdoor adventures.', 'image' => 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=600'],
            ],
            'fashion' => [
                ['name' => 'Classic Leather Jacket', 'price_aed' => 599, 'price_inr' => 13500, 'desc' => 'Timeless style made from premium top-grain leather.', 'image' => 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Designer Running Shoes', 'price_aed' => 349, 'price_inr' => 7800, 'desc' => 'Ergonomic design for maximum comfort and athletic performance.', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Elegant Silk Evening Dress', 'price_aed' => 850, 'price_inr' => 19000, 'desc' => 'Beautifully crafted silk dress for special occasions.', 'image' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Handmade Italian Leather Bag', 'price_aed' => 1200, 'price_inr' => 27000, 'desc' => 'Exquisite craftsmanship meets modern design.', 'image' => 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Minimalist Gold Watch', 'price_aed' => 650, 'price_inr' => 14500, 'desc' => 'Subtle luxury for everyday elegance.', 'image' => 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Premium Cotton Hoodie', 'price_aed' => 149, 'price_inr' => 3200, 'desc' => 'Soft, durable, and stylish comfort for your casual days.', 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'],
            ],
            'home-kitchen' => [
                ['name' => 'Automatic Espresso Machine', 'price_aed' => 1599, 'price_inr' => 36000, 'desc' => 'Barista-quality coffee at the touch of a button.', 'image' => 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Smart Air Purifier', 'price_aed' => 450, 'price_inr' => 10000, 'desc' => 'Advanced filtration for clean, breathable air in your home.', 'image' => 'https://images.unsplash.com/photo-1626084300762-5f7a376340a4?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Professional Chef Knife Set', 'price_aed' => 299, 'price_inr' => 6800, 'desc' => 'Forged high-carbon stainless steel for precision cutting.', 'image' => 'https://images.unsplash.com/photo-1614362984534-192539ec76f1?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Dyson-Style Cordless Vacuum', 'price_aed' => 1100, 'price_inr' => 25000, 'desc' => 'Powerful suction and lightweight design for effortless cleaning.', 'image' => 'https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Minimalist Ceramic Dinnerware', 'price_aed' => 249, 'price_inr' => 5500, 'desc' => 'Service for 4. Modern matte finish for contemporary dining.', 'image' => 'https://images.unsplash.com/photo-1526401481657-0bc819adc751?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Smart LED Ambient Light', 'price_aed' => 129, 'price_inr' => 2900, 'desc' => 'Millions of colors and voice control for the perfect mood.', 'image' => 'https://images.unsplash.com/photo-1563121175-3004bb49b499?auto=format&fit=crop&q=80&w=600'],
            ],
            'sports-outdoors' => [
                ['name' => 'Mountain Trail Bike', 'price_aed' => 1899, 'price_inr' => 42000, 'desc' => 'Rugged frame and advanced suspension for off-road adventures.', 'image' => 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Ultra-Lightweight 2-Person Tent', 'price_aed' => 550, 'price_inr' => 12500, 'desc' => 'Perfect for backpacking and high-altitude camping.', 'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Professional Yoga Mat', 'price_aed' => 120, 'price_inr' => 2800, 'desc' => 'Extra-thick, non-slip surface for superior comfort and grip.', 'image' => 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Adjustable Dumbbell Set', 'price_aed' => 899, 'price_inr' => 20000, 'desc' => 'Versatile home gym equipment for strength training.', 'image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Advanced Hydration Backpack', 'price_aed' => 199, 'price_inr' => 4500, 'desc' => '2L reservoir and aerodynamic design for long-distance runners.', 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Waterproof Sports Action Cam', 'price_aed' => 750, 'price_inr' => 17000, 'desc' => 'Capture your adventures in stunning detail.', 'image' => 'https://images.unsplash.com/photo-1526509867162-5b0c00cca776?auto=format&fit=crop&q=80&w=600'],
            ],
            'beauty-personal-care' => [
                ['name' => 'Luxury Face Serum', 'price_aed' => 249, 'price_inr' => 5500, 'desc' => 'Rejuvenating formula with Vitamin C and Hyaluronic acid.', 'image' => 'https://images.unsplash.com/photo-1570172619380-07149a461324?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Professional Hair Dryer', 'price_aed' => 399, 'price_inr' => 9000, 'desc' => 'Ionic technology for fast drying and smooth results.', 'image' => 'https://images.unsplash.com/photo-1566270188730-18e38ee0117b?auto=format&fit=crop&q=80&w=600'],
            ],
            'books-stationery' => [
                ['name' => 'Hardcover Journal Set', 'price_aed' => 89, 'price_inr' => 2000, 'desc' => 'Premium paper and elegant binding for your thoughts and sketches.', 'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'],
                ['name' => 'Professional Color Pencil Set', 'price_aed' => 149, 'price_inr' => 3300, 'desc' => '72 vibrant colors for artists and hobbyists.', 'image' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600'],
            ]
        ];

        // 3. Seed Products
        foreach ($categoryData as $slug => $products) {
            $category = Category::where('slug', $slug)->first();
            if (!$category)
                continue;

            foreach ($products as $p) {
                Product::updateOrCreate(
                    ['slug' => Str::slug($p['name'])],
                    [
                        'name' => $p['name'],
                        'description' => $p['desc'],
                        'category_id' => $category->id,
                        'distributor_id' => $distributor->id,
                        'sku' => strtoupper(Str::random(10)),
                        'price_aed' => $p['price_aed'],
                        'price_inr' => $p['price_inr'],
                        'distributor_price_aed' => $p['price_aed'] * 0.8,
                        'distributor_price_inr' => $p['price_inr'] * 0.8,
                        'commission_amount_aed' => $p['price_aed'] * 0.1,
                        'commission_amount_inr' => $p['price_inr'] * 0.1,
                        'stock_quantity' => rand(20, 100),
                        'status' => 'active',
                        'images' => [
                            $p['image']
                        ]
                    ]
                );
            }
        }

        $this->command->info('ProductSeeder: 24 Products seeded successfully!');
    }
}
