<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add column + new unique first (provides FK-covering index), then drop old unique
        Schema::table('restaurant_opening_hours', function (Blueprint $table) {
            $table->string('service_label', 50)
                ->nullable()
                ->after('day_of_week')
                ->comment('Service (ex: midi, soir) — NULL pour service unique toute la journée');
        });

        Schema::table('restaurant_opening_hours', function (Blueprint $table) {
            $table->unique(
                ['restaurant_id', 'day_of_week', 'service_label'],
                'restaurant_opening_hours_unique'
            );
            // Drop old unique AFTER new index exists (MySQL FK-index requirement)
            $table->dropUnique(['restaurant_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::table('restaurant_opening_hours', function (Blueprint $table) {
            $table->dropUnique('restaurant_opening_hours_unique');
            $table->dropColumn('service_label');
            $table->unique(['restaurant_id', 'day_of_week']);
        });
    }
};
