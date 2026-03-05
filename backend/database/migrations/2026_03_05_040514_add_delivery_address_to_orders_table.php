<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add free-text delivery address (replace FK-based address_id approach)
            $table->text('delivery_address')->nullable()->after('address_id');
            $table->string('recipient_name')->nullable()->after('delivery_address');
            $table->string('recipient_phone')->nullable()->after('recipient_name');

            // Alias for total — add total_amount for API compatibility
            $table->decimal('total_amount', 12, 2)->default(0)->after('total');

            // Rename order_status to status for cleaner API output
            // We add a status column that mirrors order_status
            $table->string('status')->default('pending')->after('order_status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['delivery_address', 'recipient_name', 'recipient_phone', 'total_amount', 'status']);
        });
    }
};
