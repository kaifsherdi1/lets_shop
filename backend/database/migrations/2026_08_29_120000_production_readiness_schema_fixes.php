<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Orders can be placed with a free-text delivery address only, so the
        // legacy address_id foreign key must be optional.
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable()->change();
            // The original enum ('cod','online','emi') did not include the
            // 'bank_transfer' method the checkout actually offers.
            $table->string('payment_method')->change();
        });

        // Allow a "cancelled" state so voiding an order cleanly voids its
        // pending commissions instead of leaving them dangling.
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('commission_status')->default('pending')->change();
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable(false)->change();
            $table->enum('payment_method', ['cod', 'online', 'emi'])->change();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->enum('commission_status', ['pending', 'approved', 'paid'])->default('pending')->change();
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'paid'])->default('pending')->change();
        });
    }
};
