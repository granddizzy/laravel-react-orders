<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use TCG\Voyager\Models\Role;

class AdminSeeder extends Seeder {
    public function run(): void {
        $user = User::updateOrCreate(
            ['email' => 'admin@example.com'], // Проверка по email
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin'), // Пароль admin
            ]
        );

        $adminRole = Role::where('name', 'admin')->first();

        // Проверяем, существует ли роль, и назначаем её пользователю
        if ($adminRole) {
            $user->assignRole($adminRole);  // Назначаем роль
        } else {
            // Если роль не существует, выводим ошибку или создаем роль
            $this->command->error('Роль "admin" не найдена!');
        }
    }
}
