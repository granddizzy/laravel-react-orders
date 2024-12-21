<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use TCG\Voyager\Models\Role;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function testRegister()
    {
        // Регистрируем пользователя через API
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        // Проверяем статус ответа
        $response->assertStatus(201);
        $response->assertJson(['message' => 'User registered successfully']);

        // Проверяем, что пользователь добавлен в базу данных
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        // Получаем только что созданного пользователя
        $user = User::where('email', 'test@example.com')->first();

        // Проверяем, что роль была добавлена
        $this->assertTrue($user->roles()->exists());
    }

    /** @test */
    public function user_can_login()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);
        $user->roles()->attach(Role::create(['name' => 'user', 'display_name' => 'User']));

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token',
            'user' => ['id', 'name', 'email', 'roles']
        ]);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
        $response->assertJson(['error' => 'Unauthorized']);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Logged out successfully']);

        $this->assertCount(0, $user->tokens);
    }

    /** @test */
    public function user_can_update_profile()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'password' => Hash::make('password123')
        ]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'name' => 'New Name',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'old@example.com',
        ]);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /** @test */
    public function user_can_get_data()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'email',
            'roles' => [
                '*' => ['name', 'displayName']
            ]
        ]);
    }

    /** @test */
    public function user_cannot_access_data_if_not_authenticated()
    {
        $response = $this->getJson('/api/profile');

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }
}
