<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Manager;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;

class ManagerController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $managers = Manager::all();
        return response()->json($managers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        // Валидируем входящие данные
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'organization_id' => 'required|exists:organizations,id',
        ]);

        // Проверяем, существует ли пользователь и организация
        $user = User::find($validated['user_id']);
        $organization = Organization::find($validated['organization_id']);

        // Если не существует, возвращаем ошибку
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        // Создаем нового менеджера
        $manager = Manager::create($validated);

        // Возвращаем созданного менеджера
        return response()->json($manager, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        // Получаем менеджера по ID
        $manager = Manager::find($id);

        // Если менеджер не найден, возвращаем ошибку
        if (!$manager) {
            return response()->json(['message' => 'Manager not found'], 404);
        }

        // Возвращаем найденного менеджера
        return response()->json($manager);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) {
        // Получаем менеджера по ID
        $manager = Manager::find($id);

        // Если менеджер не найден, возвращаем ошибку
        if (!$manager) {
            return response()->json(['message' => 'Manager not found'], 404);
        }

        // Валидируем входящие данные
        $validated = $request->validate([
            'organization_id' => 'nullable|exists:organizations,id',  // Если менеджер связан с организацией
        ]);

        // Обновляем менеджера
        $manager->update($validated);

        // Возвращаем обновленного менеджера
        return response()->json($manager);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        // Получаем менеджера по ID
        $manager = Manager::find($id);

        // Если менеджер не найден, возвращаем ошибку
        if (!$manager) {
            return response()->json(['message' => 'Manager not found'], 404);
        }

        // Удаляем менеджера
        $manager->delete();

        // Возвращаем успешный ответ
        return response()->json(['message' => 'Manager deleted successfully']);
    }
}
