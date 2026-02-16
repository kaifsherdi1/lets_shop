<?php


use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommissionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WalletController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [RegisterController::class , 'register']);
Route::post('/auth/login', [LoginController::class , 'login']);

// Public product routes
Route::get('/categories', [CategoryController::class , 'index']);
Route::get('/categories/{category}', [CategoryController::class , 'show']);
Route::get('/products', [ProductController::class , 'index']);
Route::get('/products/{product}', [ProductController::class , 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
  // Auth
  Route::post('/auth/logout', [LoginController::class , 'logout']);
  Route::get('/auth/me', [LoginController::class , 'me']);

  // Categories (Admin only)
  Route::post('/categories', [CategoryController::class , 'store']);
  Route::put('/categories/{category}', [CategoryController::class , 'update']);
  Route::delete('/categories/{category}', [CategoryController::class , 'destroy']);

  // Products
  Route::post('/products', [ProductController::class , 'store']);
  Route::put('/products/{product}', [ProductController::class , 'update']);
  Route::delete('/products/{product}', [ProductController::class , 'destroy']);
  Route::get('/my-products', [ProductController::class , 'myProducts']);

  // Cart
  Route::get('/cart', [CartController::class , 'index']);
  Route::post('/cart/items', [CartController::class , 'addItem']);
  Route::put('/cart/items/{cartItem}', [CartController::class , 'updateItem']);
  Route::delete('/cart/items/{cartItem}', [CartController::class , 'removeItem']);
  Route::delete('/cart/clear', [CartController::class , 'clear']);

  // Orders
  Route::get('/orders', [OrderController::class , 'index']);
  Route::post('/orders', [OrderController::class , 'store']);
  Route::get('/orders/{order}', [OrderController::class , 'show']);
  Route::post('/orders/{order}/cancel', [OrderController::class , 'cancel']);

  // Commissions
  Route::get('/commissions', [CommissionController::class , 'index']); // Admin/Accountant
  Route::get('/my-commissions', [CommissionController::class , 'myCommissions']); // Distributor/Agent
  Route::post('/commissions/{commission}/approve', [CommissionController::class , 'approve']); // Admin/Accountant
  Route::post('/commissions/bulk-approve', [CommissionController::class , 'bulkApprove']); // Admin/Accountant

  // Wallet
  Route::get('/wallet', [WalletController::class , 'index']);
  Route::post('/wallet/withdraw', [WalletController::class , 'requestWithdrawal']);
  Route::get('/my-withdrawals', [WalletController::class , 'myWithdrawals']);
  Route::get('/withdrawals', [WalletController::class , 'allWithdrawals']); // Admin/Accountant
  Route::post('/withdrawals/{withdrawalRequest}/approve', [WalletController::class , 'approveWithdrawal']); // Admin/Accountant
  Route::post('/withdrawals/{withdrawalRequest}/reject', [WalletController::class , 'rejectWithdrawal']); // Admin/Accountant
});
