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
        Schema::create('restaurant_opening_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained('restaurants')->cascadeOnDelete();
            $table->tinyInteger('day_of_week')->comment('0=Dimanche, 1=Lundi, ..., 6=Samedi');
            $table->time('opening_time');
            $table->time('closing_time');
            $table->boolean('is_closed')->default(false)->comment('Restaurant fermé ce jour');

            $table->unique(['restaurant_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_opening_hours');
    }
};
