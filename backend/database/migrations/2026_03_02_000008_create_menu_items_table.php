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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->cascadeOnDelete();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('category', ['entree', 'plat', 'dessert', 'boisson', 'accompagnement', 'autre']);
            $table->string('image_url', 500)->nullable();
            $table->integer('stock_quantity')->default(null)->nullable()->comment('NULL = stock illimité, 0 = rupture de stock, >0 = quantité disponible');
            $table->boolean('is_available')->default(true)->comment('Disponibilité immédiate');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
