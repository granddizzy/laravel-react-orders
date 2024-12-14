<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('order_product', function (Blueprint $table) {
            $table->id(); // Автоинкрементный ID (можно пропустить, если не нужен)
            $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Связь с таблицей orders
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Связь с таблицей products
            $table->integer('quantity'); // Поле для количества
            $table->timestamps(); // Поля created_at и updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_product');
    }
};
