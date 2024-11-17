<?php

namespace Tests\Feature\Api;

use App\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrganizationControllerTest extends TestCase {
    public function test_can_get_organization_list() {
        // Создаем несколько организаций для теста
        Organization::factory()->count(3)->create();

        // Отправляем GET запрос на получение списка организаций
        $response = $this->get('/api/organizations');

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что в ответе как минимум 3 организации
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }

    public function test_can_create_organization() {
        // Данные для создания организации
        $data = [
            'name' => 'Test Organization',
            'address' => '123 Test St.',
            'email' => 'test@organization.com',
            'phone' => '123456789',
            'description' => 'Test Description',
            'unp' => Str::random(12),
        ];

        // Отправляем POST запрос на создание организации
        $response = $this->post('/api/organizations', $data);

        // Проверяем, что запрос успешен (201)
        $response->assertStatus(201);

        // Проверяем, что организация была создана
        $response->assertJsonFragment([
            'name' => 'Test Organization',
        ]);
    }

    public function test_can_get_organization_by_id() {
        // Создаем организацию для теста
        $organization = Organization::factory()->create();

        // Отправляем GET запрос на получение организации по ID
        $response = $this->get("/api/organizations/{$organization->id}");

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что организация с нужным ID вернулась
        $response->assertJsonFragment([
            'id' => $organization->id,
            'name' => $organization->name,
        ]);
    }

    public function test_can_update_organization() {
        // Создаем организацию для теста
        $organization = Organization::factory()->create();

        // Данные для обновления
        $data = [
            'name' => 'Updated Organization Name',
            'address' => 'Updated Address',
            'email' => 'updated@organization.com',
            'phone' => '987654321',
            'description' => 'Updated Description',
            'unp' => Str::random(12),
        ];

        // Отправляем PUT запрос на обновление организации
        $response = $this->put("/api/organizations/{$organization->id}", $data);

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что данные обновились
        $response->assertJsonFragment([
            'name' => 'Updated Organization Name',
        ]);
    }

    public function test_can_delete_organization() {
        // Создаем организацию для теста
        $organization = Organization::factory()->create();

        // Отправляем DELETE запрос на удаление организации
        $response = $this->delete("/api/organizations/{$organization->id}");

        // Проверяем статус 200 OK
        $response->assertStatus(200);

        // Проверяем, что организация удалена
        $response->assertJsonFragment([
            'message' => 'Organization deleted successfully',
        ]);

        // Проверяем, что организация действительно удалена из базы
        $this->assertDatabaseMissing('organizations', ['id' => $organization->id]);
    }
}
