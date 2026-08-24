<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Forces all API requests to expect JSON responses.
 * Prevents Laravel from returning HTML error pages (500, 422, etc.)
 * when the frontend calls the API — ensures consistent JSON error format.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        // For all API routes, force Accept: application/json
        // This ensures Laravel returns JSON errors, not HTML pages
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
        }

        return $next($request);
    }
}
