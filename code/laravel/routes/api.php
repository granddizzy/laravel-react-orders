<?php

use App\Http\Controllers\ApiControllers\ContractorController;
use app\Http\Controllers\ApiControllers\ManagerController;
use app\Http\Controllers\ApiControllers\OrderController;
use app\Http\Controllers\ApiControllers\OrganizationController;
use app\Http\Controllers\ApiControllers\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::middleware('auth:sanctum')->group(function () {
//Route::middleware([])->group(function () {
    // Ресурсные маршруты для сущностей
    Route::apiResource('contractors', ContractorController::class); // контрагенты
    Route::apiResource('products', ProductController::class);          // Продукты (номенклатура)

    // Дополнительные маршруты
    Route::get('orders/{order}/products', [OrderController::class, 'getProducts']); // Продукты в заказе
    Route::post('orders/{order}/add-product', [OrderController::class, 'addProduct']); // Добавление товара в заказ
    Route::get('contractors/{contractor}/orders', [ContractorController::class, 'getOrders']); // Заказы контрагента

    Route::middleware(['role:admin|manager'])->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
        Route::put('/orders/{id}', [OrderController::class, 'update']);
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    });

});

// Маршруты для аутентификации
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->put('/profile', [AuthController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'getUserData']);
Route::middleware('auth:sanctum')->delete('/profile/{id}', [AuthController::class, 'deleteUser']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
