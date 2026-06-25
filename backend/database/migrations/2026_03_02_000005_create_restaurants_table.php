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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete()->comment('Utilisateur restaurateur propriétaire');
            $table->string('name', 200);
            $table->string('email', 255);
            $table->string('phone_number', 20);
            $table->text('description')->nullable();
            $table->foreignId('address_id')->constrained('addresses')->restrictOnDelete();
            $table->string('logo_url', 500)->nullable();
            $table->string('cover_image_url', 500)->nullable();
            $table->string('cuisine_type', 100)->nullable()->comment('Type de cuisine (française, italienne, etc.)');
            $table->enum('price_range', ['€', '€€', '€€€', '€€€€'])->default('€€');
            $table->integer('capacity')->default(0)->comment('Nombre de couverts maximum');
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('allow_pre_order')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
