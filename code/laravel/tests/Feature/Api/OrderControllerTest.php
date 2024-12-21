<?php

namespace Tests\Feature\Api;

use App\Models\Contractor;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест метода index для возврата пагинированных заказов.
     */
    public function test_index_returns_paginated_orders()
    {
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken; // Генерация токена

        // Создание нескольких заказов для теста
        Order::factory()->count(20)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавление токена в заголовок
        ])->getJson(route('orders.index', ['per_page' => 5, 'page' => 1]));

        // Проверка ответа
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [  // Каждый элемент в data должен содержать эти поля
                        'id',
                        'shipping_address',
                        'total_amount',
                        'notes',
                        'created_at',
                        'updated_at',
                        'contractor', // Проверка на contractor, если он подгружается
                        'products',   // Проверка на продукты, если они подгружаются
                    ]
                ],
                'current_page',
                'last_page',
            ]);
    }

    /**
     * Тест метода store для создания нового заказа.
     */
    public function test_store_creates_new_order()
    {
        $user = User::factory()->create();
        $contractor = Contractor::factory()->create();
        $products = Product::factory()->count(3)->create();

        $token = $user->createToken('Test Token')->plainTextToken;

        $payload = [
            'shipping_address' => '123 Test St',
            'contractor_id' => $contractor->id,
            'products' => $products->map(function ($product) {
                return [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'price' => 100,
                ];
            })->toArray(),
            'notes' => 'Test order notes',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавление токена в заголовок
        ])->postJson(route('orders.store'), $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'shipping_address',
                'total_amount',
            ]);

        $this->assertDatabaseHas('orders', [
            'shipping_address' => '123 Test St',
            'contractor_id' => $contractor->id,
        ]);
    }

    /**
     * Тест метода show для получения одного заказа.
     */
    public function test_show_returns_single_order()
    {
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken;

        $order = Order::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавление токена в заголовок
        ])->getJson(route('orders.show', $order->id));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'shipping_address',
                'total_amount',
                'notes',
                'created_at',
                'updated_at',
                'contractor',
                'products',
                'user',
            ]);
    }

    /**
     * Тест метода update для обновления существующего заказа.
     */
    public function test_update_modifies_existing_order()
    {
        $user = User::factory()->create();
        $contractor = Contractor::factory()->create();
        $order = Order::factory()->create();

        $token = $user->createToken('Test Token')->plainTextToken;

        // Модификация данных заказа
        $payload = [
            'shipping_address' => 'Updated Test St',
            'contractor_id' => $contractor->id,
            'products' => [
                [
                    'product_id' => $order->products()->first()->id,
                    'quantity' => 5,
                    'price' => 200,
                ],
            ],
            'notes' => 'Updated notes',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавление токена в заголовок
        ])->putJson(route('orders.update', $order->id), $payload);

        // Проверка ответа с ожиданием contractor в данных
        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'shipping_address',
                'total_amount',
                'notes',
                'contractor' => [
                    'id',
                    'name', // Добавьте дополнительные поля, которые вы хотите проверить
                ],
                'products' => [
                    '*' => [
                        'id',
                        'name', // Убедитесь, что здесь указаны нужные поля для продуктов
                    ],
                ],
                'user' => [
                    'id',
                    'name',
                ],
            ]);

        // Проверка в базе данных
        $this->assertDatabaseHas('orders', [
            'shipping_address' => 'Updated Test St',
        ]);
    }

    /**
     * Тест метода destroy для удаления заказа.
     */
    public function test_destroy_deletes_order()
    {
        $user = User::factory()->create();
        $order = Order::factory()->create();

        $token = $user->createToken('Test Token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавление токена в заголовок
        ])->deleteJson(route('orders.destroy', $order->id));

        $response->assertStatus(200)
            ->assertJson(['message' => 'Order deleted successfully']);

        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }
}
