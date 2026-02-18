<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->index('order_id');
            $table->index('product_id');
            $table->index('distributor_id');
            $table->index('commission_status');
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->index('order_item_id');
            $table->index('distributor_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['order_id']);
            $table->dropIndex(['product_id']);
            $table->dropIndex(['distributor_id']);
            $table->dropIndex(['commission_status']);
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->dropIndex(['order_item_id']);
            $table->dropIndex(['distributor_id']);
            $table->dropIndex(['status']);
        });
    }
};
