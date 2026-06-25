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
        Schema::create('reservation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->comment('NULL si invité non inscrit sur l\'app');
            $table->string('guest_name', 200)->nullable()->comment('Nom si user_id NULL');
            $table->string('guest_email', 255)->nullable()->comment('Email si user_id NULL');
            $table->enum('invitation_status', ['pending', 'accepted', 'declined'])->default('pending');
            $table->timestamp('invitation_sent_at')->nullable();
            $table->timestamp('response_at')->nullable();
            $table->timestamp('added_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_participants');
    }
};
