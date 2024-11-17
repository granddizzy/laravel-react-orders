<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company, // Название организации
            'address' => $this->faker->address, // Адрес организации
            'email' => $this->faker->unique()->safeEmail, // Email организации
            'phone' => $this->faker->phoneNumber, // Контактный телефон
            'description' => $this->faker->paragraph, // Описание организации
            'unp' => $this->faker->unique()->numerify('#########'), // Уникальный номер (УНП)
        ];
    }
}
