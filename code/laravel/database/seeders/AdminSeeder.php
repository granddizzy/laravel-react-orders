<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder {
    public function run(): void {
        User::updateOrCreate(
            ['email' => 'admin@example.com'], // Проверка по email
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin'), // Пароль admin
            ]
        );

        DB::table('user_roles')->updateOrInsert(
            [
                'user_id' => 1,
                'role_id' => 1,
            ]
        );
    }
}
