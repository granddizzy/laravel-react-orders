<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        // Валидируем входящие параметры
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100', // Количество заказов на странице
            'page' => 'integer|min:1', // Номер страницы
            'search' => 'nullable|string', // Строка поиска
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;
        $search = $validated['search'] ?? null;

        // Начинаем построение запроса
        $query = Order::query();

        // Подгружаем связанные данные
        $query->with(['contractor', 'products']);

        // Фильтрация по строке поиска, если она задана
        if ($search) {
            $query->where(function ($q) use ($search) {
                // Фильтрация по полям самого заказа
                $q->where('shipping_address', 'like', '%' . $search . '%')  // Поиск по адресу доставки
                ->orWhere('id', 'like', '%' . $search . '%')  // Поиск по ID заказа
                // Фильтрация по имени контрагента
                ->orWhereHas('contractor', function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                })
                    // Фильтрация по имени продукта
                    ->orWhereHas('products', function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        // Применяем пагинацию
        $orders = $query->paginate($perPage, ['*'], 'page', $page);

        // Возвращаем результат в формате JSON
        //        return response()->json($orders);
        // Возвращаем результат без лишней вложенности data
        return response()->json([
            'data' => OrderResource::collection($orders), // Каждый заказ через OrderResource
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
//            'per_page' => $orders->perPage(),
//            'total' => $orders->total(),
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
        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        // Проверяем, имеет ли пользователь роль 'admin' или 'manager'
        if (!$user->hasRole('admin') && !$user->hasRole('manager')) {
            return response()->json(['error' => 'У вас нет прав для создания заказа'], 403); // Возвращаем ошибку, если пользователь не администратор
        }

        // Валидируем данные запроса
        $validated = $request->validate([
            'shipping_address' => 'nullable|string',
            //            'billing_address' => 'nullable|string',
            'contractor_id' => 'required|exists:contractors,id',  // Привязка к контрагенту
            'products' => 'required|array',  // Продукты, связанные с заказом
            'products.*.product_id' => 'required|exists:products,id',  // Каждый продукт должен существовать
            'products.*.quantity' => 'required|numeric|min:1',  // Количество каждого продукта
            'products.*.price' => 'required|numeric|min:0',  // Цена каждого продукта
            'notes' => 'nullable|string',  // Поле для заметок
        ]);

        $userId = auth()->id();
        $products = $request->input('products', []);

        $total_amount = 0;
        foreach ($products as $product) {
            $total_amount += $product['quantity'] * $product['price'];
        }

        // Используем транзакцию
        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $userId,
                'shipping_address' => $validated['shipping_address'],
                //                'billing_address' => $validated['billing_address'],
                'contractor_id' => $validated['contractor_id'],
                'total_amount' => $total_amount,
                'notes' => $validated['notes'],
            ]);

            // Привязываем продукты к заказу
            foreach ($products as $product) {
                $order->products()->attach($product['product_id'], [
                    'quantity' => $product['quantity'], // Указываем количество
                    'price' => $product['price'], // Указываем цену
                ]);
            }
            DB::commit(); // Фиксируем транзакцию
            //                        return response()->json($order, 201);
            return (new OrderResource($order))
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack(); // Откатываем транзакцию в случае ошибки
            Log::error('Error creating order', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        // Получаем заказ по ID
        try {
            $order = Order::with('contractor', 'products', 'user')->findOrFail($id);
        } catch (\Exception $e) {
            Log::error('Error fetching order:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Если заказ не найден, возвращаем ошибку
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $orderArray = $order->toArray();
        try {
            //            Log::info('Order data: ', ['order' => $order->toArray()]);
            //            return response()->json($orderArray);
            return new OrderResource($order);
        } catch (\Exception $e) {
            //            Log::error('Error fetching order:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Order not found'], 404);
        }
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
        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        // Проверяем, имеет ли пользователь роль 'admin' или 'manager'
        if (!$user->hasRole('admin') && !$user->hasRole('manager')) {
            return response()->json(['error' => 'У вас нет прав для обновления заказа'], 403); // Возвращаем ошибку, если пользователь не администратор
        }

        // Находим заказ по ID
        $order = Order::findOrFail($id);

        // Если заказ не найден, возвращаем ошибку
//        if (!$order) {
//            return response()->json(['message' => 'Order not found'], 404);
//        }

        // Валидируем данные запроса
        $validated = $request->validate([
            'shipping_address' => 'nullable|string',
            'contractor_id' => 'required|exists:contractors,id',  // Привязка к контрагенту
            'products' => 'required|array',  // Продукты, связанные с заказом
            'products.*.product_id' => 'required|exists:products,id',  // Каждый продукт должен существовать
            'products.*.quantity' => 'required|numeric|min:1',  // Количество каждого продукта
            'products.*.price' => 'required|numeric|min:0',  // Цена каждого продукта
            'notes' => 'nullable|string',  // Поле для заметок
        ]);

        $products = $request->input('products', []);

        $total_amount = 0;
        foreach ($products as $product) {
            $total_amount += $product['quantity'] * $product['price'];
        }

        // Используем транзакцию
        DB::beginTransaction();

        try {
            $order->update([
                'shipping_address' => $validated['shipping_address'],
                'contractor_id' => $validated['contractor_id'],
                'total_amount' => $total_amount,
                'notes' => $validated['notes'],
            ]);

            // Удаляем все текущие продукты
            $order->products()->detach();

            // Добавляем новые продукты
            foreach ($products as $product) {
                $order->products()->attach($product['product_id'], [
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                ]);
            }
            DB::commit(); // Фиксируем транзакцию

            // Загружаем связанные данные (contractor, products) перед возвращением ресурса
            $order->load('contractor', 'products');

            //            return response()->json($order, 201);
            return (new OrderResource($order));
        } catch (\Exception $e) {
            DB::rollBack(); // Откатываем транзакцию в случае ошибки
            Log::error('Error updating order', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        // Получаем текущего аутентифицированного пользователя
        $user = auth()->user();

        // Проверяем, имеет ли пользователь роль 'admin'
        if (!$user || !$user->hasRole('admin')) {
            return response()->json(['error' => 'У вас нет прав для удаления заказа'], 403); // Возвращаем ошибку, если пользователь не администратор
        }

        // Находим заказ по ID
        $order = Order::find($id);

        // Если заказ не найден, возвращаем ошибку
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Удаляем заказ
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}
