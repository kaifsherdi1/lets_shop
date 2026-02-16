<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
  public function run(): void
  {
    $categories = [
      ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and gadgets'],
      ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing and accessories'],
      ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen', 'description' => 'Home appliances and kitchenware'],
      ['name' => 'Beauty & Personal Care', 'slug' => 'beauty-personal-care', 'description' => 'Beauty products and personal care items'],
      ['name' => 'Sports & Outdoors', 'slug' => 'sports-outdoors', 'description' => 'Sports equipment and outdoor gear'],
      ['name' => 'Books & Stationery', 'slug' => 'books-stationery', 'description' => 'Books, office supplies, and stationery'],
      ['name' => 'Toys & Games', 'slug' => 'toys-games', 'description' => 'Toys and gaming products'],
      ['name' => 'Health & Wellness', 'slug' => 'health-wellness', 'description' => 'Health and wellness products'],
    ];

    foreach ($categories as $category) {
      Category::create([
        'name' => $category['name'],
        'slug' => $category['slug'],
        'description' => $category['description'],
        'status' => 'active',
      ]);
    }
  }
}
