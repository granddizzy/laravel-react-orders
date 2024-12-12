<?php

namespace app\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Валидируем входящие параметры
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100', // Минимум 1, максимум 100 товаров на страницу
            'page' => 'integer|min:1', // Минимум первая страница
        ]);

        // Получаем параметры пагинации из запроса (по умолчанию: 10 товаров на страницу и первая страница)
        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;

        // Используем пагинацию для модели Product
        $products = Product::paginate($perPage, ['*'], 'page', $page);

        // Возвращаем данные в формате JSON
        return response()->json($products);
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
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'unit' => 'nullable|string',
        'stock_quantity' => 'required|integer|min:0',
//        'sku' => 'nullable|string|unique:products',  // Уникальность артикулов
      ]);

      // Создаем новый продукт
      $product = Product::create($validated);

      // Возвращаем созданный продукт
      return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
      // Получаем продукт по ID
      $product = Product::find($id);

      // Если продукт не найден, возвращаем ошибку
      if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
      }

      // Возвращаем найденный продукт
      return response()->json($product);
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
      // Получаем продукт по ID
      $product = Product::find($id);

      // Если продукт не найден, возвращаем ошибку
      if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
      }

      // Валидируем входящие данные
      $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'price' => 'nullable|numeric|min:0',
        'unit' => 'nullable|string',
        'stock_quantity' => 'nullable|integer|min:0',
        'sku' => 'nullable|string|unique:products,sku,' . $id,  // Уникальность артикулов с учетом текущего продукта
      ]);

      // Обновляем продукт
      $product->update($validated);

      // Возвращаем обновленный продукт
      return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
      // Получаем продукт по ID
      $product = Product::find($id);

      // Если продукт не найден, возвращаем ошибку
      if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
      }

      // Удаляем продукт
      $product->delete();

      // Возвращаем успешный ответ
      return response()->json(['message' => 'Product deleted successfully']);
    }
}
