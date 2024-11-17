<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word, // Название продукта
            'description' => $this->faker->sentence, // Описание
            'price' => $this->faker->randomFloat(2, 1, 1000), // Цена (от 1 до 1000 с двумя знаками после запятой)
            'unit' => $this->faker->randomElement(['шт', 'кг', 'л']), // Единица измерения
            'stock_quantity' => $this->faker->numberBetween(0, 1000), // Количество на складе (от 0 до 1000)
            'sku' => $this->faker->unique()->lexify('SKU???'), // Артикул
        ];
    }
}
