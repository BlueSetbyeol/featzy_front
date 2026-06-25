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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->comment('Utilisateur qui commande');
            $table->enum('status', ['draft', 'submitted', 'confirmed', 'preparing', 'served', 'cancelled'])->default('draft');
            $table->decimal('total_amount', 10, 2)->default(0.00)->comment('Montant total calculé');
            $table->text('notes')->nullable()->comment('Notes pour la cuisine');
            $table->enum('type', ['pre_order', 'on_site'])->default('on_site');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
