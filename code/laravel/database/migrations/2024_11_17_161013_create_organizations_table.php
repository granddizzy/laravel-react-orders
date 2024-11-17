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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');  // Название организации
            $table->string('address')->nullable();  // Адрес организации
            $table->string('email')->nullable();  // Email организации
            $table->string('phone')->nullable();  // Контактный телефон
            $table->text('description')->nullable();  // Описание организации
            $table->string('unp')->unique();  // Уникальный номер
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
