<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $orders = Order::with('products')->get();
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
            'user_id' => 'required|exists:users,id',
            'manager_id' => 'required|exists:managers,id',
            'status' => 'required|in:pending,confirmed,shipped,completed,cancelled',
            'total_amount' => 'required|numeric',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'ordered_at' => 'nullable|date',
            'shipped_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'organization_id' => 'required|exists:organizations,id',  // Привязка к организации
            'contractor_id' => 'required|exists:contractors,id',  // Привязка к контрагенту
            'products' => 'required|array',  // Продукты, связанные с заказом
            'products.*.product_id' => 'required|exists:products,id',  // Каждый продукт должен существовать
            'products.*.quantity' => 'required|integer|min:1',  // Количество каждого продукта
        ]);

        // Создаем заказ
        $order = Order::create($validated);

        // Привязываем продукты к заказу (через pivot таблицу)
        foreach ($request->products as $product) {
            $order->products()->attach($product['product_id'], [
                'quantity' => $product['quantity'],
                'price' => $product['price'],  // цена может быть передана в запросе
                'total' => $product['quantity'] * $product['price'],  // Общая сумма за продукт
            ]);
        }

        return response()->json($order, 201);
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
