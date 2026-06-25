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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable()->after('phone_number')->constrained('addresses')->nullOnDelete();
            $table->boolean('email_verified')->default(false)->after('is_active');
            $table->string('email_verification_token', 255)->nullable()->after('email_verified');
            $table->string('password_reset_token', 255)->nullable()->after('email_verification_token');
            $table->timestamp('password_reset_expires')->nullable()->after('password_reset_token');
            $table->timestamp('last_login_at')->nullable()->after('password_reset_expires');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['address_id']);
            $table->dropColumn([
                'address_id',
                'email_verified',
                'email_verification_token',
                'password_reset_token',
                'password_reset_expires',
                'last_login_at',
            ]);
        });
    }
};
