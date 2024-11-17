<?php

namespace Tests\Feature\Api;

use App\Models\Contractor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;

class ConstractorControllerTest extends TestCase
{
    public function test_can_create_contractor() {
        $randomUnp = Str::random(12);
        // Данные для создания контрагента
        $data = [
            'name' => 'Test Contractor',
            'unp' => $randomUnp, // Уникальный unp
            'contact_person' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' =>  "0123456789",
            'address' => 'Test Address',
        ];

        // Отправляем POST запрос на создание контрагента
        $response = $this->post('/api/contractors', $data);

        // Проверяем, что статус 201 (Created)
        $response->assertStatus(201);

        // Проверяем, что контрагент был создан
        $response->assertJsonFragment([
            'name' => 'Test Contractor',
            'unp' =>  $randomUnp,
        ]);
    }

    public function test_can_update_contractor() {
        // Создаем контрагента для теста
        $contractor = Contractor::factory()->create();

        // Генерируем уникальный unp для обновления
        $randomUnp = Str::random(12);

        // Данные для обновления контрагента
        $data = [
            'name' => 'Updated Contractor Name',
            'unp' => $randomUnp, // Уникальный unp для обновления
            'contact_person' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '987654321',
            'address' => 'Updated Address',
        ];

        // Отправляем PUT запрос на обновление контрагента
        $response = $this->put("/api/contractors/{$contractor->id}", $data);

        // Проверяем статус 200 (OK)
        $response->assertStatus(200);

        // Проверяем, что данные обновились
        $response->assertJsonFragment([
            'name' => 'Updated Contractor Name',
            'unp' => $randomUnp, // Проверка нового уникального unp
        ]);
    }

    public function test_can_get_contractor_list() {
        // Создаем несколько контрагентов для теста
        Contractor::factory()->count(3)->create();

        // Отправляем GET запрос на получение списка контрагентов
        $response = $this->get('/api/contractors');

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что в ответе хотя бы 3 контрагента
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }

    public function test_can_delete_contractor() {
        // Создаем контрагента для теста
        $contractor = Contractor::factory()->create();

        // Отправляем DELETE запрос на удаление контрагента
        $response = $this->delete("/api/contractors/{$contractor->id}");

        // Проверяем статус 200 (OK)
        $response->assertStatus(200);

        // Проверяем, что контрагент был удален
        $response->assertJsonFragment([
            'message' => 'Contractor deleted successfully',
        ]);

        // Проверяем, что контрагент действительно удален из базы данных
        $this->assertDatabaseMissing('contractors', ['id' => $contractor->id]);
    }
}
