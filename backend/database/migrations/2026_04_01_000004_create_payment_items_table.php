<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')
                ->constrained('payments')
                ->cascadeOnDelete();
            $table->foreignId('order_item_id')
                ->constrained('order_items')
                ->cascadeOnDelete();
            $table->decimal('amount', 10, 2)
                ->comment('Montant imputé à cet item dans ce paiement');

            $table->unique(['payment_id', 'order_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_items');
    }
};
