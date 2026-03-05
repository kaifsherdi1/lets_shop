<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('otp_verifications', function (Blueprint $table) {
            $table->string('email')->after('user_id')->nullable();
            $table->string('type')->change(); // Change from enum to string to support 'registration'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('otp_verifications', function (Blueprint $table) {
            $table->dropColumn('email');
            // Reverting change() for enum is complex and often unnecessary in dev, 
            // but we could leave it as string as it's more flexible.
        });
    }
};
