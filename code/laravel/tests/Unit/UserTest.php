<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Contractor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use TCG\Voyager\Models\Role;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_have_roles()
    {
        // Создаем роль вручную
        $role = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
        ]);

        $user = User::factory()->create();

        // Привязываем роль к пользователю
        $user->roles()->attach($role);

        // Проверяем, что пользователь имеет роль
        $this->assertTrue($user->roles->contains($role));
    }

    /** @test */
    public function user_can_have_contractors()
    {
        // Создаем контрагента и пользователя
        $contractor = Contractor::factory()->create();
        $user = User::factory()->create();

        // Привязываем контрагента к пользователю
        $user->contractors()->attach($contractor);

        // Проверяем, что пользователь имеет контрагента
        $this->assertTrue($user->contractors->contains($contractor));
    }

    /** @test */
    public function user_can_have_tokens()
    {
        // Создаем пользователя
        $user = User::factory()->create();

        // Генерируем токен для пользователя
        $token = $user->createToken('TestToken')->plainTextToken;

        // Проверяем, что токен существует
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    /** @test */
    public function user_password_is_hashed()
    {
        // Создаем пользователя с паролем
        $password = 'secretpassword';
        $user = User::factory()->create([
            'password' => $password
        ]);

        // Проверяем, что пароль захеширован
        $this->assertTrue(Hash::check($password, $user->password));
    }

    /** @test */
    public function user_email_is_verified_at_on_creation()
    {
        // Создаем пользователя с подтвержденной электронной почтой
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        // Проверяем, что email_verified_at не пустой
        $this->assertNotNull($user->email_verified_at);
    }
}
