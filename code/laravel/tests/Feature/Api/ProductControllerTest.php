<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\User; // Импортируем модель User
use Illuminate\Foundation\Testing\RefreshDatabase;
use TCG\Voyager\Models\Role;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест получения списка продуктов.
     */
    public function test_can_get_product_list()
    {
        // Создаем несколько продуктов
        Product::factory()->count(5)->create();

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken; // Получаем plainTextToken

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавляем токен в заголовок
        ])->getJson('/api/products');

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'price',
                        'unit',
                        'stock_quantity',
                        'sku',
                    ],
                ],
                'current_page',
                'last_page',
            ]);
    }

    /**
     * Тест создания нового продукта.
     */
    public function test_can_create_product()
    {
        $data = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            'unit' => 'pcs',
            'stock_quantity' => 10,
            'sku' => 'TEST1234',
        ];

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();

        // Создаем роль 'admin' и привязываем к пользователю
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Администратор']);
        $user->roles()->attach($adminRole);

        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/products', $data);

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Test Product',
                'price' => 99.99,
            ]);

        // Убедимся, что продукт был сохранен в базе данных
        $this->assertDatabaseHas('products', $data);
    }

    /**
     * Тест получения продукта по ID.
     */
    public function test_can_show_product()
    {
        // Создаем продукт
        $product = Product::factory()->create();

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/products/{$product->id}");

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $product->id,
                'name' => $product->name,
            ]);
    }

    /**
     * Тест обновления продукта.
     */
    public function test_can_update_product()
    {
        // Создаем продукт
        $product = Product::factory()->create();

        // Новые данные для обновления
        $data = [
            'name' => 'Updated Product Name',
            'price' => 199.99,
        ];

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();

        // Создаем роль 'admin' и привязываем к пользователю
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Администратор']);
        $user->roles()->attach($adminRole);

        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/products/{$product->id}", $data);

        // Проверяем статус ответа и обновленные данные
        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Product Name',
                'price' => 199.99,
            ]);

        // Убедимся, что данные были обновлены в базе
        $this->assertDatabaseHas('products', $data);
    }

    /**
     * Тест удаления продукта.
     */
    public function test_can_delete_product()
    {
        // Создаем продукт
        $product = Product::factory()->create();

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();

        // Создаем роль 'admin' и привязываем к пользователю
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Администратор']);
        $user->roles()->attach($adminRole);

        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/products/{$product->id}");

        // Проверяем статус ответа
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Product deleted successfully',
            ]);

        // Убедимся, что продукт был удален из базы
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
