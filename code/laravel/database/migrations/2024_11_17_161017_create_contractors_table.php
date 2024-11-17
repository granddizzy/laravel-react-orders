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
        Schema::create('contractors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');  // Название контрагента
            $table->string('unp')->unique();  // УНП (уникальный номер плательщика)
            $table->string('contact_person')->nullable();  // Контактное лицо
            $table->string('email')->nullable();  // Email контрагента
            $table->string('phone')->nullable();  // Телефон контрагента
            $table->string('address')->nullable();  // Адрес контрагента
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractors');
    }
};
