<?php

// tests/Unit/OrderTest.php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\User;
use App\Models\Contractor;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тестирование атрибутов модели Order
     */
    public function test_order_has_fillable_attributes()
    {
        $fillableAttributes = [
            'user_id',
            'contractor_id',
            'shipping_address',
            'billing_address',
            'total_amount',
            'notes'
        ];

        $order = new Order();
        $fillable = $order->getFillable();

        foreach ($fillableAttributes as $attribute) {
            $this->assertContains($attribute, $fillable);
        }
    }

    /**
     * Тестирование автоматического добавления даты 'ordered_at' при создании заказа
     */
    public function test_order_sets_ordered_at_on_creation()
    {
        $orderData = [
            'user_id' => User::factory()->create()->id,
            'contractor_id' => Contractor::factory()->create()->id,
            'shipping_address' => 'Test Address',
            'billing_address' => 'Test Billing Address',
            'total_amount' => 100,
            'notes' => 'Test Note',
        ];

        $order = Order::create($orderData);

        // Проверяем, что 'ordered_at' не null и установлено время создания
        $this->assertNotNull($order->ordered_at);
        $this->assertEquals(now()->format('Y-m-d'), $order->ordered_at->format('Y-m-d'));
    }

    /**
     * Тестирование связи с пользователем (belongsTo)
     */
    public function test_order_belongs_to_user()
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        // Проверяем, что заказ принадлежит пользователю
        $this->assertTrue($order->user->is($user));
    }

    /**
     * Тестирование связи с контрагентом (belongsTo)
     */
    public function test_order_belongs_to_contractor()
    {
        $contractor = Contractor::factory()->create();
        $order = Order::factory()->create(['contractor_id' => $contractor->id]);

        // Проверяем, что заказ принадлежит контрагенту
        $this->assertTrue($order->contractor->is($contractor));
    }

    /**
     * Тестирование связи многие ко многим с продуктами
     */
    public function test_order_has_products_relationship()
    {
        $order = Order::factory()->create();
        $product = Product::factory()->create();

        // Привязываем продукт к заказу
        $order->products()->attach($product->id, ['quantity' => 1, 'price' => 50]);

        // Загружаем связанные продукты с базы, чтобы получить обновленную коллекцию
        $order->load('products');

        // Проверяем, что продукт связан с заказом
        $this->assertTrue($order->products->contains($product));
    }

    /**
     * Тестирование сохранения данных в базу
     */
    public function test_order_can_be_created()
    {
        $user = User::factory()->create();
        $contractor = Contractor::factory()->create();

        $orderData = [
            'user_id' => $user->id,
            'contractor_id' => $contractor->id,
            'shipping_address' => 'Test Address',
            'billing_address' => 'Test Billing Address',
            'total_amount' => 100,
            'notes' => 'Test Note',
        ];

        $order = Order::create($orderData);

        // Проверяем, что заказ был сохранен в базе
        $this->assertDatabaseHas('orders', $orderData);
    }
}
