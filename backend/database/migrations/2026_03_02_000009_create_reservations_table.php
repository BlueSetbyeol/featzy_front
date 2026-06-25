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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->cascadeOnDelete()->comment('Utilisateur qui organise');
            $table->foreignId('restaurant_id')->constrained('restaurants')->cascadeOnDelete();
            $table->dateTime('reservation_datetime')->comment('Date et heure de la réservation');
            $table->integer('number_of_guests')->default(1);
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])->default('pending');
            $table->string('table_number', 20)->nullable();
            $table->text('special_requests')->nullable()->comment('Demandes spéciales (allergie, anniversaire, etc.)');
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
