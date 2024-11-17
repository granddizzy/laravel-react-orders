<?php

namespace Database\Factories;

use App\Models\Contractor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contractor>
 */
class ContractorFactory extends Factory {
    protected $model = Contractor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {

        return [
            'name' => $this->faker->company, // Название компании
            'unp' => $this->faker->unique()->numerify('#########'), // УНП (номер плательщика)
            'contact_person' => $this->faker->name, // Контактное лицо
            'email' => $this->faker->unique()->safeEmail, // Email
            'phone' => $this->faker->phoneNumber, // Телефон
            'address' => $this->faker->address, // Адрес
        ];
    }
}
