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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');  // Название продукта
            $table->text('description')->nullable();  // Описание продукта
            $table->decimal('price', 10, 2);  // Цена продукта
            $table->string('unit')->nullable();  // Единица измерения (например, штука, кг, литр)
            $table->integer('stock_quantity')->default(0);  // Количество на складе
            $table->string('sku')->nullable()->unique();  // Артикул продукта
            #$table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');  // Категория продукта (если есть)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
