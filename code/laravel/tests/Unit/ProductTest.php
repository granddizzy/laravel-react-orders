<?php

// tests/Unit/ProductTest.php
namespace Tests\Unit;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase; // Очищаем базу после каждого теста

    /**
     * Тестирование атрибутов модели
     */
    public function test_product_has_fillable_attributes()
    {
        $fillableAttributes = ['name', 'description', 'price', 'unit', 'stock_quantity', 'sku'];

        $product = new Product();
        $fillable = $product->getFillable();

        foreach ($fillableAttributes as $attribute) {
            $this->assertContains($attribute, $fillable);
        }
    }

    /**
     * Тестирование связи с заказами
     */
    public function test_product_has_orders_relationship()
    {
        $product = Product::factory()->create(); // Создаём продукт
        $order = Order::factory()->create(); // Создаём заказ

        // Создаем связь через метод pivot (продукт принадлежит заказу)
        $product->orders()->attach($order->id, ['quantity' => 10]);

        // Проверяем, что продукт связан с заказом
        $this->assertTrue($product->orders->contains($order));
    }

    /**
     * Тестирование сохранения данных в базу
     */
    public function test_product_can_be_created()
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'This is a test product.',
            'price' => 100.50,
            'unit' => 'pcs',
            'stock_quantity' => 100,
            'sku' => 'SKU12345'
        ];

        $product = Product::create($productData);

        // Проверяем, что продукт был сохранен
        $this->assertDatabaseHas('products', $productData);
    }
}
