<?php

namespace Database\Factories;

use App\Models\Contractor;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory {
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition() {
        // Генерируем случайный заказ
        $shippingAddress = $this->faker->address;
        $notes = $this->faker->sentence;

        // Создаем несколько продуктов с помощью фабрики
        $products = Product::factory()->count(3)->create(); // Генерация 3 случайных продуктов

        // Считаем общую стоимость, исходя из продуктов
        $totalAmount = $products->sum(function ($product) {
            return $product->price * 1;  // 1 — количество каждого продукта
        });

        return [
            'user_id' => User::factory(),  // Генерация пользователя
            'contractor_id' => Contractor::factory(),  // Генерация контрагента
            'shipping_address' => $shippingAddress,
            'total_amount' => $totalAmount,  // Рассчитанная общая стоимость
            'notes' => $notes,
            'ordered_at' => $this->faker->dateTimeThisYear(),
        ];
    }

    public function configure() {
        return $this->afterCreating(function (Order $order) {
            // Генерируем продукты для этого заказа
            $products = Product::factory()->count(3)->create();  // Создание 3 продуктов

            foreach ($products as $product) {
                // Прикрепляем продукты к заказу
                $order->products()->attach($product->id, [
                    'quantity' => 1,  // Количество каждого продукта
                    'price' => $product->price,  // Цена каждого продукта
                ]);
            }

            // Пересчитываем total_amount на основе прикрепленных продуктов
            $totalAmount = $order->products->sum(function ($product) {
                return $product->pivot->price * $product->pivot->quantity;
            });

            // Обновляем total_amount в заказе
            $order->update(['total_amount' => $totalAmount]);
        });
    }
}
