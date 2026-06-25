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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained('restaurants')->cascadeOnDelete();
            $table->string('name', 200)->comment('Ex: Menu du midi, Menu été 2026');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable()->comment('Date de début de validité');
            $table->date('valid_to')->nullable()->comment('Date de fin de validité');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
