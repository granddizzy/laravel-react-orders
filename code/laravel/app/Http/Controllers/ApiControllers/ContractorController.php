<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Contractor;
use Illuminate\Http\Request;

class ContractorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contractors = Contractor::all();
        return response()->json($contractors);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Валидируем входящие данные
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unp' => 'required|string|unique:contractors',  // Уникальность УНП
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        // Создаем нового контрагента
        $contractor = Contractor::create($validated);

        // Возвращаем созданного контрагента
        return response()->json($contractor, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Получаем контрагента по ID
        $contractor = Contractor::find($id);

        // Если контрагент не найден, возвращаем ошибку
        if (!$contractor) {
            return response()->json(['message' => 'Contractor not found'], 404);
        }

        // Возвращаем найденного контрагента
        return response()->json($contractor);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
      // Получаем контрагента по ID
      $contractor = Contractor::find($id);

      // Если контрагент не найден, возвращаем ошибку
      if (!$contractor) {
        return response()->json(['message' => 'Contractor not found'], 404);
      }

      // Валидируем входящие данные
      $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'unp' => 'nullable|string|unique:contractors,unp,' . $id,  // Уникальность УНП с учетом текущего контрагента
        'contact_person' => 'nullable|string|max:255',
        'email' => 'nullable|email',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
      ]);

      // Обновляем контрагента
      $contractor->update($validated);

      // Возвращаем обновленного контрагента
      return response()->json($contractor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
      // Получаем контрагента по ID
      $contractor = Contractor::find($id);

      // Если контрагент не найден, возвращаем ошибку
      if (!$contractor) {
        return response()->json(['message' => 'Contractor not found'], 404);
      }

      // Удаляем контрагента
      $contractor->delete();

      // Возвращаем успешный ответ
      return response()->json(['message' => 'Contractor deleted successfully']);
    }
}
