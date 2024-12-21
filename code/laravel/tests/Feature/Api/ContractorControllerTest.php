<?php

namespace Tests\Feature\Api;

use App\Models\Contractor;
use App\Models\User; // Импортируем модель User
use Illuminate\Foundation\Testing\RefreshDatabase;
use TCG\Voyager\Models\Role;
use Tests\TestCase;

class ContractorControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест получения списка контрагентов.
     */
    public function test_can_get_contractor_list()
    {
        // Создаем несколько контрагентов
        Contractor::factory()->count(5)->create();

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken; // Получаем plainTextToken

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавляем токен в заголовок
        ])->getJson('/api/contractors');

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'unp',
                        'contact_person',
                        'email',
                        'phone',
                        'address',
                    ],
                ],
                'current_page',
                'last_page',
            ]);
    }

    /**
     * Тест создания нового контрагента.
     */
    public function test_can_create_contractor()
    {
        $data = [
            'name' => 'Test Contractor',
            'unp' => '123456789',
            'contact_person' => 'John Doe',
            'email' => 'test@example.com',
            'phone' => '+1234567890',
            'address' => '123 Test Street',
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
        ])->postJson('/api/contractors', $data);

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Test Contractor',
                'unp' => '123456789',
            ]);

        // Убедимся, что контрагент был сохранен в базе данных
        $this->assertDatabaseHas('contractors', $data);
    }

    /**
     * Тест получения контрагента по ID.
     */
    public function test_can_show_contractor()
    {
        // Создаем контрагента
        $contractor = Contractor::factory()->create();

        // Создаем пользователя и генерируем токен для Sanctum
        $user = User::factory()->create();
        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/contractors/{$contractor->id}");

        // Проверяем статус ответа и структуру данных
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $contractor->id,
                'name' => $contractor->name,
            ]);
    }

    /**
     * Тест обновления контрагента.
     */
    public function test_can_update_contractor()
    {
        // Создаем контрагента
        $contractor = Contractor::factory()->create();

        // Новые данные для обновления
        $data = [
            'name' => 'Updated Contractor Name',
            'email' => 'updated@example.com',
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
        ])->putJson("/api/contractors/{$contractor->id}", $data);

        // Проверяем статус ответа и обновленные данные
        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Contractor Name',
                'email' => 'updated@example.com',
            ]);

        // Убедимся, что данные были обновлены в базе
        $this->assertDatabaseHas('contractors', $data);
    }

    /**
     * Тест удаления контрагента.
     */
    public function test_can_delete_contractor()
    {
        // Создаем контрагента
        $contractor = Contractor::factory()->create();

        // Создаем пользователя
        $user = User::factory()->create();

        // Создаем роль 'admin' и привязываем к пользователю
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Администратор']);
        $user->roles()->attach($adminRole);

        // Генерируем токен для пользователя с ролью 'admin'
        $token = $user->createToken('Test Token')->plainTextToken;

        // Выполняем запрос с токеном
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token, // Добавляем токен в заголовок
        ])->deleteJson("/api/contractors/{$contractor->id}");

        // Проверяем статус ответа
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Contractor deleted successfully', // Сообщение об успешном удалении
            ]);

        // Убедимся, что контрагент был удален из базы
        $this->assertDatabaseMissing('contractors', ['id' => $contractor->id]);
    }
}

