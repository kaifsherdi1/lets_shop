<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
  public function run(): void
  {
    $categories = [
      ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and gadgets', 'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing and accessories', 'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen', 'description' => 'Home appliances and kitchenware', 'image' => 'https://images.unsplash.com/photo-1556911220-e15023057581?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Beauty & Personal Care', 'slug' => 'beauty-personal-care', 'description' => 'Beauty products and personal care items', 'image' => 'https://images.unsplash.com/photo-1522335758218-a11bd40e3da9?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Sports & Outdoors', 'slug' => 'sports-outdoors', 'description' => 'Sports equipment and outdoor gear', 'image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Books & Stationery', 'slug' => 'books-stationery', 'description' => 'Books, office supplies, and stationery', 'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Toys & Games', 'slug' => 'toys-games', 'description' => 'Toys and gaming products', 'image' => 'https://images.unsplash.com/photo-1531050171669-01103a886420?auto=format&fit=crop&q=80&w=800'],
      ['name' => 'Health & Wellness', 'slug' => 'health-wellness', 'description' => 'Health and wellness products', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'],
    ];

    foreach ($categories as $category) {
      Category::create([
        'name' => $category['name'],
        'slug' => $category['slug'],
        'description' => $category['description'],
        'image' => $category['image'],
        'status' => 'active',
      ]);
    }
  }
}
