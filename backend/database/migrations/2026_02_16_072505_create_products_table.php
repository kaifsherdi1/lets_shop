<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('distributor_id')->constrained('users')->onDelete('cascade');
            $table->string('sku')->unique();

            // Dual currency pricing
            $table->decimal('price_inr', 10, 2);
            $table->decimal('price_aed', 10, 2);
            $table->decimal('distributor_price_inr', 10, 2);
            $table->decimal('distributor_price_aed', 10, 2);
            $table->decimal('commission_amount_inr', 10, 2);
            $table->decimal('commission_amount_aed', 10, 2);

            $table->integer('stock_quantity')->default(0);
            $table->json('images')->nullable();

            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();

            $table->enum('status', ['active', 'inactive', 'out_of_stock'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('category_id');
            $table->index('distributor_id');
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
