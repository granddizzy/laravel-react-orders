<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Validator;
use TCG\Voyager\Models\Role;

class UserController extends Controller {
    public function index(Request $request) {
        // Валидируем входящие параметры
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100', // Минимум 1, максимум 100 элементов на страницу
            'page' => 'integer|min:1', // Минимум первая страница
            'search' => 'nullable|string', // Параметр поиска
        ]);

        // Получаем параметры пагинации и поиска из запроса
        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $search = $validated['search'] ?? null;

        // Строим запрос для пользователей с отношениями 'roles' и 'contractors'
        $query = User::with('roles', 'contractors');

        // Если есть строка для поиска, добавляем фильтрацию
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%') // Пример: поиск по имени
                ->orWhere('email', 'like', '%' . $search . '%'); // Пример: поиск по email
            });
        }

        // Применяем пагинацию
        $users = $query->paginate($perPage, ['*'], 'page', $page);

        // Возвращаем данные в формате JSON
        return response()->json($users);
    }

    public function destroy(Request $request, $id) {
        // Проверка, существует ли пользователь с данным id
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Удаление пользователя
        $user->delete();

        // Возвращаем сообщение об успешном удалении
        return response()->json(['message' => 'Пользователь успешно удален']);
    }

    public function show(Request $request, $id) {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Получаем роли пользователя
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
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
            'contractors' => $user->contractors,
        ];

        // Возвращаем данные пользователя
        return response()->json($userData);
    }

    public function addRole(Request $request, $id) {
        // Валидация входных данных
        $request->validate([
            'role_id' => 'required|integer',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Проверяем, существует ли роль
        $role = Role::find($request->role_id);

        if (!$role) {
            return response()->json(['error' => 'Роль не найдена'], 404);
        }

        // Добавляем роль пользователю (если не добавлена ранее)
        $user->roles()->syncWithoutDetaching([$role->id]);

        // Получаем роли пользователя
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
            'contractors' => $user->contractors,
        ];

        // Возвращаем обновленные данные пользователя
        return response()->json($userData);
    }

    public function removeRole(Request $request, $id, $roleId) {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Проверяем, существует ли роль
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json(['error' => 'Роль не найдена'], 404);
        }

        // Проверка: является ли это последней ролью
        if ($user->roles->count() <= 1) {
            return response()->json(['error' => 'Нельзя удалить последнюю роль пользователя'], 400);
        }

        // Удаляем роль у пользователя, если она существует
        $user->roles()->detach($role);
        $user = $user->fresh('roles');

        // Получаем обновленные роли пользователя
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
            'contractors' => $user->contractors,
        ];

        // Возвращаем обновленные данные пользователя
        return response()->json($userData);
    }

    public function addContractor(Request $request, $id) {
        // Валидация входных данных
        $request->validate([
            'contractor_id' => 'required|integer',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Проверяем, существует ли контрагент
        $contractor = Contractor::find($request->contractor_id);

        if (!$contractor) {
            return response()->json(['error' => 'Контрагент не найден'], 404);
        }

        // Добавляем контрагента пользователю (если не добавлен ранее)
        if (!$user->contractors()->where('contractor_id', $contractor->id)->exists()) {
            $user->contractors()->attach($contractor);
        }

        // Получаем роли пользователя
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        // Формируем данные для ответа
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
            'contractors' => $user->contractors,
        ];

        // Возвращаем обновленные данные пользователя
        return response()->json($userData);
    }

    public function removeContractor(Request $request, $id, $contractor_id) {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Пользователь не найден'], 404);
        }

        // Проверяем, существует ли контрагент
        $contractor = Contractor::find($contractor_id);

        if (!$contractor) {
            return response()->json(['error' => 'Контрагент не найден'], 404);
        }

        // Проверяем наличие контрагента у пользователя и удаляем связь
        if ($user->contractors()->where('contractor_id', $contractor->id)->exists()) {
            $user->contractors()->detach($contractor);
        } else {
            return response()->json(['error' => 'У пользователя нет связи с этим контрагентом'], 400);
        }
        $user = $user->fresh('contractors');

        // Получаем обновленные роли и контрагентов
        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'displayName' => $role->display_name,
            ];
        });

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roles,
            'contractors' => $user->contractors,
        ];

        // Возвращаем обновленные данные пользователя
        return response()->json($userData);
    }

    public function getRoles(Request $request) {
        $roles = DB::table('roles')->get();
        return response()->json($roles);
    }
}
