<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use TCG\Voyager\Models\Role;

class AuthController extends Controller {
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $userRole = Role::firstOrCreate(['name' => 'user', 'display_name' => 'Пользователь']);
        //        $userRole = Role::where('name', 'user')->first();
        // добавляем роль пользователя
        $user->roles()->attach($userRole);
        //        DB::table('user_roles')->updateOrInsert(
        //            [
        //                'user_id' => $user->id,
        //                'role_id' => $userRole->id,
        //            ]
        //        );

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Если валидация не прошла
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Проверка, существует ли пользователь с данным email
        $user = User::where('email', $request->email)->first();

        // Если пользователь не найден или пароль неверный
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Удаляем все старые токены
        $user->tokens()->delete();

        // Создаем новый токен
        $token = $user->createToken('AuthToken')->plainTextToken;

        $roles = $user->roles->map(function ($role) {
            return [
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
        ];

        return response()->json([
            'token' => $token,
            'user' => $userData,
        ]);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updateProfile(Request $request) {
        // Валидация входных данных
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
        ]);

        // Если валидация не прошла
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Пользователь не аутентифицирован'], 401);
        }

        // Обновляем имя пользователя
        $user->name = $request->name;

        // Если передан новый пароль, хешируем его и обновляем
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Сохраняем обновленные данные
        $user->save();

        $roles = $user->roles->map(function ($role) {
            return [
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
        ];

        // Возвращаем обновленные данные пользователя
        return response()->json($userData);
    }

    public function getUserData(Request $request) {
        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        // Если пользователь не аутентифицирован
        if (!$user) {
            return response()->json(['error' => 'Пользователь не аутентифицирован'], 401);
        }

        // Получаем роли пользователя
        $roles = $user->roles->map(function ($role) {
            return [
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        // Формируем данные пользователя
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
        ];

        // Возвращаем данные пользователя
        return response()->json($userData);
    }
}
