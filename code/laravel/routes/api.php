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
    // Доступ для всех (чтение данных)
    Route::get('/contractors', [ContractorController::class, 'index']);
    Route::get('/contractors/{id}', [ContractorController::class, 'show']);

    // Доступ для администраторов и менеджеров (создание и обновление)
    Route::middleware(['role:admin|manager'])->group(function () {
        Route::post('/contractors', [ContractorController::class, 'store']);
        Route::put('/contractors/{id}', [ContractorController::class, 'update']);
    });

//     Доступ только для администраторов (удаление)
    Route::middleware(['role:admin'])->group(function () {
        Route::delete('/contractors/{id}', [ContractorController::class, 'destroy']);
    });

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    Route::middleware(['role:admin|manager'])->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });

    // Дополнительные маршруты
    Route::get('orders/{order}/products', [OrderController::class, 'getProducts']); // Продукты в заказе
    Route::get('contractors/{contractor}/orders', [ContractorController::class, 'getOrders']); // Заказы контрагента

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
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
