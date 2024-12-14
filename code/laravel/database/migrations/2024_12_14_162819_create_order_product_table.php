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
            $table->id(); // Автоинкрементный ID
            $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Связь с таблицей orders
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Связь с таблицей products
            $table->decimal('quantity', 10, 2)->default(1); // Поле для количества, например, 10.50
            $table->decimal('price', 10, 2)->default(0); // Цена за единицу товара
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
