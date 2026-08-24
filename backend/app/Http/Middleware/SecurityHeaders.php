<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Adds security HTTP response headers to every API response.
 * These headers prevent common web attacks: clickjacking, MIME-sniffing,
 * XSS via content injection, and information leakage.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent the response from being framed (clickjacking)
        $response->headers->set('X-Frame-Options', 'DENY');

        // Stop browser from MIME-sniffing the content type
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS filtering in older browsers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Restrict referrer information sent to other origins
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions policy: disable unnecessary browser features
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Remove server signature to avoid fingerprinting
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        // HSTS — tell browsers to only use HTTPS for 1 year (only in production)
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Ensure all API responses always return JSON, never HTML
        if ($request->is('api/*') && !$response->headers->has('Content-Type')) {
            $response->headers->set('Content-Type', 'application/json');
        }

        return $response;
    }
}
