<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Security: Force JSON responses on all API routes
        $middleware->prepend(\App\Http\Middleware\ForceJsonResponse::class);
        // Security: Add hardening headers to all responses
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        // CORS: Must come after ForceJson, before routing
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        // Alias for role-based access control middleware
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return JSON errors for API routes — never HTML
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Resource not found.'], 404);
            }
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Method not allowed.'], 405);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated. Please log in.'], 401);
            }
        });

        // Generic server error — hide details in production
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') && !config('app.debug')) {
                $code = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                if ($code >= 500) {
                    return response()->json(['message' => 'An unexpected server error occurred. Please try again later.'], 500);
                }
            }
        });
    })->create();

