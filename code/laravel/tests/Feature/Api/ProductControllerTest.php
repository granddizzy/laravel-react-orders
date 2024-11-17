<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductControllerTest extends TestCase {
    /**
     * Test to get list of products.
     *
     * @return void
     */
    public function test_can_get_product_list() {
        // Создаем несколько продуктов для теста
        Product::factory()->count(3)->create();

        // Отправляем GET запрос на получение списка продуктов
        $response = $this->get('/api/products');

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что в ответе есть как минимум 3 продукта
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }

    /**
     * Test to create a new product.
     *
     * @return void
     */
    public function test_can_create_product() {
        // Данные для создания нового продукта
        $data = [
            'name' => 'Test Product',
            'price' => 20.99,
            'stock_quantity' => 100,
        ];

        // Отправляем POST запрос для создания продукта
        $response = $this->postJson('/api/products', $data);

        // Проверяем, что продукт был успешно создан (статус 201)
        $response->assertStatus(201);

        // Проверяем, что возвращаемые данные содержат переданные данные
        $response->assertJson([
            'name' => 'Test Product',
            'price' => 20.99,
            'stock_quantity' => 100,
        ]);
    }

    /**
     * Test to show a product.
     *
     * @return void
     */
    public function test_can_show_product() {
        // Создаем продукт для теста
        $product = Product::factory()->create();

        // Отправляем GET запрос для получения продукта по ID
        $response = $this->get('/api/products/' . $product->id);

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что продукт содержится в ответе
        $response->assertJson([
            'id' => $product->id,
            'name' => $product->name,
        ]);
    }

    /**
     * Test for product not found.
     *
     * @return void
     */
    public function test_product_not_found() {
        // Отправляем GET запрос с несуществующим ID
        $response = $this->get('/api/products/999');

        // Проверяем, что получаем ошибку 404
        $response->assertStatus(404);
    }

    /**
     * Test to update a product.
     *
     * @return void
     */
    public function test_can_update_product() {
        // Создаем продукт для теста
        $product = Product::factory()->create();

        // Данные для обновления
        $data = [
            'name' => 'Updated Product',
            'price' => 15.99,
            'stock_quantity' => 50,
        ];

        // Отправляем PUT запрос для обновления продукта
        $response = $this->putJson('/api/products/' . $product->id, $data);

        // Проверяем, что статус 200 (успешное обновление)
        $response->assertStatus(200);

        // Проверяем, что данные были обновлены
        $response->assertJson([
            'name' => 'Updated Product',
            'price' => 15.99,
            'stock_quantity' => 50,
        ]);
    }

    /**
     * Test for product not found during update.
     *
     * @return void
     */
    public function test_product_not_found_for_update() {
        // Отправляем PUT запрос с несуществующим ID
        $response = $this->putJson('/api/products/999', []);

        // Проверяем, что получаем ошибку 404
        $response->assertStatus(404);
    }

    /**
     * Test to delete a product.
     *
     * @return void
     */
    public function test_can_delete_product()
    {
        // Создаем продукт для теста
        $product = Product::factory()->create();

        // Отправляем DELETE запрос для удаления продукта
        $response = $this->deleteJson('/api/products/' . $product->id);

        // Проверяем, что статус 200 (успешное удаление)
        $response->assertStatus(200);

        // Проверяем, что продукт больше не существует в базе данных
        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    /**
     * Test for product not found during delete.
     *
     * @return void
     */
    public function test_product_not_found_for_delete()
    {
        // Отправляем DELETE запрос с несуществующим ID
        $response = $this->deleteJson('/api/products/999');

        // Проверяем, что получаем ошибку 404
        $response->assertStatus(404);
    }
}
