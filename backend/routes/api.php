<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\OtpController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommissionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\WalletController;
use Illuminate\Support\Facades\Route;

// Public routes — rate-limited to 10 req/min per IP (brute-force protection)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/register', [RegisterController::class, 'register']);
    Route::post('/auth/login', [LoginController::class, 'login']);
    Route::post('/auth/verify-otp', [OtpController::class, 'verify']);
    Route::post('/auth/resend-otp', [OtpController::class, 'resend']);
});

// Public product routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
  // Auth
  Route::post('/auth/logout', [LoginController::class, 'logout']);
  Route::get('/auth/me', [LoginController::class, 'me']);

  // User Profile (all authenticated users)
  Route::get('/profile', [UserProfileController::class, 'show']);
  Route::put('/profile', [UserProfileController::class, 'update']);
  Route::post('/profile/change-password', [UserProfileController::class, 'changePassword']);

  // Categories (Admin/Manager only for destructive actions)
  Route::middleware('role:admin,manager')->group(
    function () {
      Route::post('/categories', [CategoryController::class, 'store']);
      Route::put('/categories/{category}', [CategoryController::class, 'update']);
      Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    }
  );

  // Products (Admin/Manager/Distributor/Agent)
  Route::middleware('role:admin,manager,distributor,agent')->group(
    function () {
      Route::post('/products', [ProductController::class, 'store']);
      Route::put('/products/{product}', [ProductController::class, 'update']);
      Route::delete('/products/{product}', [ProductController::class, 'destroy']);
      Route::get('/my-products', [ProductController::class, 'myProducts']);
    }
  );

  // Cart (All authenticated users)
  Route::get('/cart', [CartController::class, 'index']);
  Route::post('/cart/items', [CartController::class, 'addItem']);
  Route::put('/cart/items/{cartItem}', [CartController::class, 'updateItem']);
  Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem']);
  Route::delete('/cart/clear', [CartController::class, 'clear']);

  // Orders
  Route::get('/orders', [OrderController::class, 'index']);
  Route::post('/orders', [OrderController::class, 'store']);
  Route::get('/orders/{order}', [OrderController::class, 'show']);
  Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

  // Commissions
  Route::middleware('role:admin,accountant')->group(
    function () {
      Route::get('/commissions', [CommissionController::class, 'index']);
      Route::post('/commissions/{commission}/approve', [CommissionController::class, 'approve']);
      Route::post('/commissions/bulk-approve', [CommissionController::class, 'bulkApprove']);
    }
  );
  Route::get('/my-commissions', [CommissionController::class, 'myCommissions'])->middleware('role:distributor,agent');

  // Wallet
  Route::get('/wallet', [WalletController::class, 'index']);
  Route::post('/wallet/withdraw', [WalletController::class, 'requestWithdrawal']);
  Route::get('/my-withdrawals', [WalletController::class, 'myWithdrawals']);

  Route::middleware('role:admin,accountant')->group(
    function () {
      Route::get('/withdrawals', [WalletController::class, 'allWithdrawals']);
      Route::post('/withdrawals/{withdrawalRequest}/approve', [WalletController::class, 'approveWithdrawal']);
      Route::post('/withdrawals/{withdrawalRequest}/reject', [WalletController::class, 'rejectWithdrawal']);
    }
  );

  // ── Admin / Manager routes ───────────────────────────────────
  Route::middleware('role:admin,manager')->group(function () {
    Route::get('/admin/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
    Route::get('/admin/monthly-stats', [\App\Http\Controllers\Api\AdminController::class, 'monthlyStats']);
    Route::get('/admin/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::get('/admin/users/{id}', [\App\Http\Controllers\Api\AdminController::class, 'userShow']);
    Route::patch('/admin/orders/{id}/status', [\App\Http\Controllers\Api\AdminController::class, 'updateOrderStatus']);
    Route::patch('/admin/users/{id}/status', [\App\Http\Controllers\Api\AdminController::class, 'toggleUserStatus']);
  });

  // ── Admin-only (user management) ─────────────────────────────
  Route::middleware('role:admin')->group(function () {
    Route::post('/admin/users', [\App\Http\Controllers\Api\AdminController::class, 'userStore']);
    Route::patch('/admin/users/{id}/role', [\App\Http\Controllers\Api\AdminController::class, 'updateUserRole']);
    Route::get('/admin/roles', function () {
      return \App\Models\Role::select('slug', 'name')->orderBy('id')->get();
    });
  });

  // ── Distributor/Agent portal routes ──────────────────────────
  Route::middleware('role:distributor,agent')->group(function () {
    Route::get('/portal/stats', [\App\Http\Controllers\Api\PortalController::class, 'stats']);
    Route::get('/portal/commissions', [CommissionController::class, 'myCommissions']);
    Route::get('/portal/products', [ProductController::class, 'myProducts']);
    Route::get('/portal/wallet', [WalletController::class, 'index']);
    Route::get('/portal/withdrawals', [WalletController::class, 'myWithdrawals']);
  });
});
