<?php

// tests/Unit/ContractorTest.php

namespace Tests\Unit;

use App\Models\Contractor;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractorTest extends TestCase
{
    use RefreshDatabase; // Очищаем базу после каждого теста

    /**
     * Тестирование атрибутов модели Contractor
     */
    public function test_contractor_has_fillable_attributes()
    {
        $fillableAttributes = ['name', 'unp', 'contact_person', 'email', 'phone', 'address'];

        $contractor = new Contractor();
        $fillable = $contractor->getFillable();

        foreach ($fillableAttributes as $attribute) {
            $this->assertContains($attribute, $fillable);
        }
    }

    /**
     * Тестирование кастов
     */
    public function test_contractor_has_casts()
    {
        $casts = ['created_at' => 'datetime', 'updated_at' => 'datetime', 'id' => 'int',];

        $contractor = new Contractor();
        $this->assertEquals($casts, $contractor->getCasts());
    }

    /**
     * Тестирование связи один ко многим с заказами
     */
    public function test_contractor_has_orders_relationship()
    {
        $contractor = Contractor::factory()->create(); // Создаем контрагента
        $order = Order::factory()->create(['contractor_id' => $contractor->id]); // Создаем заказ

        // Проверяем, что заказ связан с контрагентом
        $this->assertTrue($contractor->orders->contains($order));
    }

    /**
     * Тестирование связи многие ко многим с пользователями
     */
    public function test_contractor_has_users_relationship()
    {
        $contractor = Contractor::factory()->create(); // Создаем контрагента
        $user = User::factory()->create(); // Создаем пользователя

        // Привязываем пользователя к контрагенту
        $contractor->users()->attach($user->id);

        // Проверяем, что контрагент связан с пользователем
        $this->assertTrue($contractor->users->contains($user));
    }

    /**
     * Тестирование сохранения данных в базу
     */
    public function test_contractor_can_be_created()
    {
        $contractorData = [
            'name' => 'Test Contractor',
            'unp' => '1234567890',
            'contact_person' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1234567890',
            'address' => '123 Test Street, Test City',
        ];

        $contractor = Contractor::create($contractorData);

        // Проверяем, что контрагент был сохранен
        $this->assertDatabaseHas('contractors', $contractorData);
    }
}
