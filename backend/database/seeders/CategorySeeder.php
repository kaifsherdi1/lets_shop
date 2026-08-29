<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $images = collect(
            json_decode(File::get(__DIR__ . '/data/categories.json'), true) ?: []
        )->keyBy('slug');

        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Laptops, phones, tablets and audio.'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing, footwear, bags and accessories.'],
            ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen', 'description' => 'Furniture, decor and kitchen essentials.'],
            ['name' => 'Beauty & Personal Care', 'slug' => 'beauty-personal-care', 'description' => 'Skincare, makeup and fragrances.'],
            ['name' => 'Sports & Outdoors', 'slug' => 'sports-outdoors', 'description' => 'Sports gear and outdoor equipment.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image' => $images->get($category['slug'])['image'] ?? null,
                    'status' => 'active',
                ]
            );
        }
    }
}
