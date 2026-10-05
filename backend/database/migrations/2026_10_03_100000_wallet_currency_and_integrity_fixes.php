<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Commissions are earned in the order's currency (AED or INR) but wallets
     * had a single currency-less balance, so the two were silently added
     * together. Wallets and withdrawals become per-currency; existing rows are
     * AED (the store's default currency).
     *
     * Also adds the indexes the storefront/admin filters rely on, and a unique
     * key on ledger entries so the same commission/withdrawal can never be
     * posted to a wallet twice.
     */
    public function up(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->string('currency', 3)->default('AED')->after('user_id');
        });

        Schema::table('wallets', function (Blueprint $table) {
            // Add the composite key first: on MySQL the user_id foreign key
            // must always be covered by an index.
            $table->unique(['user_id', 'currency']);
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });

        Schema::table('withdrawal_requests', function (Blueprint $table) {
            $table->string('currency', 3)->default('AED')->after('user_id');
            $table->index('status');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->unique(['reference_type', 'reference_id', 'type'], 'transactions_reference_unique');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('created_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->index('created_at');
        });

        Schema::table('otp_verifications', function (Blueprint $table) {
            $table->index(['email', 'type']);
        });
    }

    public function down(): void
    {
        Schema::table('otp_verifications', function (Blueprint $table) {
            $table->dropIndex(['email', 'type']);
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropUnique('transactions_reference_unique');
        });

        Schema::table('withdrawal_requests', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn('currency');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->unique('user_id');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'currency']);
            $table->dropColumn('currency');
        });
    }
};
