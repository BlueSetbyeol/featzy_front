<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->enum('bill_split_type', ['individual', 'equal_split', 'custom'])
                ->default('individual')
                ->after('special_requests')
                ->comment('individual = chacun paie sa commande, equal_split = partage égal, custom = items spécifiques');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('bill_split_type');
        });
    }
};
