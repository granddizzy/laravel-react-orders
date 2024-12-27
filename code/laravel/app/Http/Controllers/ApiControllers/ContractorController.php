<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContractorResource;
use App\Models\Contractor;
use Illuminate\Http\Request;

class ContractorController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        // Валидируем входящие параметры
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100', // Минимум 1, максимум 100 элементов на страницу
            'page' => 'integer|min:1', // Минимум первая страница
            'search' => 'nullable|string', // Параметр поиска (по наименованию или другим данным)
        ]);

        // Получаем параметры пагинации и поиска из запроса
        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $search = $validated['search'] ?? null;

        // Получаем аутентифицированного пользователя
        $user = auth()->user();

        // Строим запрос для контрагентов, в зависимости от роли пользователя
        if ($user->hasAnyRole(['admin'])) {
            // Если пользователь администратор, то возвращаем всех контрагентов
            $query = Contractor::query();
        } else {
            // Если пользователь не администратор, возвращаем только привязанные контрагенты
            $query = $user->contractors();
        }

        // Если есть строка для поиска, добавляем фильтрацию
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%') // Пример: поиск по имени
                ->orWhere('unp', 'like', '%' . $search . '%') // Пример: поиск по sku
                ->orWhere('email', 'like', '%' . $search . '%') // Пример: поиск по email
                ->orWhere('phone', 'like', '%' . $search . '%') // Пример: поиск по email
                ->orWhere('contact_person', 'like', '%' . $search . '%') // Пример: поиск по email
                ->orWhere('phone', 'like', '%' . $search . '%'); // Пример: поиск по телефону
            });
        }

        $query->orderBy('name', 'asc');

        // Применяем пагинацию
        $contractors = $query->paginate($perPage, ['*'], 'page', $page);

        // Возвращаем данные в формате JSON
        //        return response()->json($contractors);
        return response()->json([
            'data' => ContractorResource::collection($contractors),
            'current_page' => $contractors->currentPage(),
            'last_page' => $contractors->lastPage(),
//            'per_page' => $contractors->perPage(),
//            'total' => $contractors->total(),
        ]);
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
        //        return response()->json($contractor, 201);
        return (new ContractorResource($contractor))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        // Получаем контрагента по ID
        $contractor = Contractor::find($id);

        // Если контрагент не найден, возвращаем ошибку
        if (!$contractor) {
            return response()->json(['message' => 'Contractor not found'], 404);
        }

        // Возвращаем найденного контрагента
        //        return response()->json($contractor);
        return new ContractorResource($contractor);
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
        //      return response()->json($contractor);
        return new ContractorResource($contractor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
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
