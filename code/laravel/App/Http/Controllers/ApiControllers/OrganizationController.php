<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $organizations = Organization::all();
        return response()->json($organizations);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
            'unp' => 'required|string|unique:organizations',
        ]);

        // Создаём новую организацию
        $organization = Organization::create($validated);

        // Возвращаем созданную организацию
        return response()->json($organization, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        $organization = Organization::find($id);

        // Если организация не найдена, возвращаем ошибку
        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        // Возвращаем найденную организацию
        return response()->json($organization);
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
        // Получаем организацию по ID
        $organization = Organization::find($id);

        // Если организация не найдена, возвращаем ошибку
        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        // Валидируем входящие данные
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
            'unp' => 'nullable|string|unique:organizations,unp,' . $id,  // Уникальность UNP с учётом текущей организации
        ]);

        // Обновляем организацию
        $organization->update($validated);

        // Возвращаем обновлённую организацию
        return response()->json($organization);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        // Получаем организацию по ID
        $organization = Organization::find($id);

        // Если организация не найдена, возвращаем ошибку
        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        // Удаляем организацию
        $organization->delete();

        // Возвращаем успешный ответ
        return response()->json(['message' => 'Organization deleted successfully']);
    }
}
