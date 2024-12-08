<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

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

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updateProfile(Request $request)
    {
        // Валидация входных данных
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255', // Имя обязательно
            'password' => 'nullable|string|min:8|confirmed', // Если пароль передан, он должен быть подтвержден и не менее 6 символов
        ]);

        // Если валидация не прошла
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        // Обновляем имя пользователя
        $user->name = $request->name;

        // Если передан новый пароль, хешируем его и обновляем
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Сохраняем обновленные данные
        $user->save();

        // Возвращаем обновленные данные пользователя
        return response()->json($user);
    }
}
