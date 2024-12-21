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
    Route::apiResource('organizations', OrganizationController::class); // организации
    Route::apiResource('contractors', ContractorController::class); // контрагенты
    Route::apiResource('managers', ManagerController::class);          // Менеджеры
    Route::apiResource('products', ProductController::class);          // Продукты (номенклатура)
    Route::apiResource('orders', OrderController::class);              // Заказы

    // Дополнительные маршруты
    Route::get('orders/{order}/products', [OrderController::class, 'getProducts']); // Продукты в заказе
    Route::post('orders/{order}/add-product', [OrderController::class, 'addProduct']); // Добавление товара в заказ
    Route::get('managers/{manager}/orders', [ManagerController::class, 'getOrders']); // Заказы менеджера
    Route::get('contractors/{contractor}/orders', [ContractorController::class, 'getOrders']); // Заказы контрагента
});

// Маршруты для аутентификации
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->put('/profile', [AuthController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'getUserData']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);


