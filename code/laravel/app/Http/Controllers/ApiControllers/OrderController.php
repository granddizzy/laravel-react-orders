<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller {
    /**
     * Display a listing of the resource.
     */
    //    public function index(Request $request) {
    //        // Валидируем входящие параметры
    //        $validated = $request->validate([
    //            'per_page' => 'integer|min:1|max:100', // Количество заказов на странице
    //            'page' => 'integer|min:1', // Номер страницы
    //            'search' => 'nullable|string', // Строка поиска
    //        ]);
    //
    //        // Получаем параметры из запроса
    //        $perPage = $validated['per_page'] ?? 10;
    //        $page = $validated['page'] ?? 1;
    //        $search = $validated['search'] ?? null;
    //
    //        // Строим запрос
    //        $query = Order::query()->with(['contractor', 'products']); // Подгружаем связанные модели
    //
    //        // Если передана строка поиска, добавляем фильтрацию
    //        if ($search) {
    //            $query->where(function ($q) use ($search) {
    //                // Поиск по контрагенту
    //                $q->whereHas('contractor', function ($contractorQuery) use ($search) {
    //                    $contractorQuery->where('name', 'like', '%' . $search . '%');
    //                });
    //
    //                // Поиск по продукту
    //                $q->orWhereHas('products', function ($productQuery) use ($search) {
    //                    $productQuery->where('name', 'like', '%' . $search . '%')
    //                        ->orWhere('sku', 'like', '%' . $search . '%'); // Пример поиска по SKU
    //                });
    //            });
    //        }
    //
    //        // Применяем пагинацию
    //        $orders = $query->paginate($perPage, ['*'], 'page', $page);
    //
    //        // Возвращаем данные в формате JSON
    //        return response()->json($orders);
    //    }
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
                ->orWhere('billing_address', 'like', '%' . $search . '%')  // Поиск по адресу для счета
                ->orWhere('id', 'like', '%' . $search . '%');  // Поиск по ID заказа
            });
        }

        // Применяем пагинацию
        $orders = $query->paginate($perPage, ['*'], 'page', $page);

        // Возвращаем результат в формате JSON
        return response()->json($orders);
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
        // Валидируем данные запроса
        $validated = $request->validate([
            //            'user_id' => 'required|exists:users,id',
            'manager_id' => 'required|exists:managers,id',
            //            'status' => 'required|in:pending,confirmed,shipped,completed,cancelled',
            //            'total_amount' => 'required|numeric',
            'shipping_address' => 'nullable|string',
            //            'billing_address' => 'nullable|string',
            //            'ordered_at' => 'nullable|date',
            //            'shipped_at' => 'nullable|date',
            //            'completed_at' => 'nullable|date',
            //            'organization_id' => 'required|exists:organizations,id',  // Привязка к организации
            'contractor_id' => 'required|exists:contractors,id',  // Привязка к контрагенту
            'products' => 'required|array',  // Продукты, связанные с заказом
            'products.*.product_id' => 'required|exists:products,id',  // Каждый продукт должен существовать
            'products.*.quantity' => 'required|integer|min:1',  // Количество каждого продукта
        ]);

        $products = $request->input('products', []);

        // Создаем заказ
        //        $order = Order::create($validated);
        //
        //        // Привязываем продукты к заказу (через pivot таблицу)
        //        foreach ($request->products as $product) {
        //            $order->products()->attach($product['product_id'], [
        //                'quantity' => $product['quantity'],
        ////                'price' => $product['price'],  // цена может быть передана в запросе
        ////                'total' => $product['quantity'] * $product['price'],  // Общая сумма за продукт
        //            ]);
        //        }

        // Используем транзакцию
        DB::beginTransaction();

        try {
            $order = Order::create([
                'manager_id' => $validated['manager_id'],
                'shipping_address' => $validated['shipping_address'],
                //            'billing_address' => $validated['billing_address'],
                'contractor_id' => $validated['contractor_id'],
                // Здесь могут быть другие поля, например, дата создания или статус
            ]);

            // Привязываем продукты к заказу
            foreach ($products as $product) {
                $order->products()->attach($product['product_id'], [
                    'quantity' => $product['quantity'], // Указываем количество
                    // Вы можете добавить дополнительные данные, такие как цена или скидка
                ]);
            }
            DB::commit(); // Фиксируем транзакцию
            return response()->json($order, 201);
        } catch (\Exception $e) {
            DB::rollBack(); // Откатываем транзакцию в случае ошибки
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        // Получаем заказ по ID
        $order = Order::with('products')->find($id);

        // Если заказ не найден, возвращаем ошибку
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
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
        // Находим заказ по ID
        $order = Order::find($id);

        // Если заказ не найден, возвращаем ошибку
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Валидируем данные запроса
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,completed,cancelled',
            'total_amount' => 'required|numeric',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'ordered_at' => 'nullable|date',
            'shipped_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);

        // Обновляем заказ
        $order->update($validated);

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
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
