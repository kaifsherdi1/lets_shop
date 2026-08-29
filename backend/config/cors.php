<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing (CORS)
|--------------------------------------------------------------------------
| The storefront and admin dashboard call this API from a different origin
| (Vercel), so those origins must be whitelisted. Set FRONTEND_USER_URL and
| FRONTEND_ADMIN_URL in the environment; all *.vercel.app preview URLs are
| also allowed via a pattern so Vercel preview deploys keep working.
*/

$origins = array_values(array_filter([
    env('FRONTEND_USER_URL'),
    env('FRONTEND_ADMIN_URL'),
]));

// Local dev origins — only outside production.
if (env('APP_ENV', 'production') !== 'production') {
    $origins = array_merge($origins, [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ]);
}

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => [
        '#^https://([a-z0-9-]+\.)*vercel\.app$#i',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,
];
