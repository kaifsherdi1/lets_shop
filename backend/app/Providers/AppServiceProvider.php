<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();

        \Illuminate\Support\Facades\Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));
    }

    protected function configureRateLimiting(): void
    {
        \Illuminate\Support\Facades\RateLimiter::for ('api', function (\Illuminate\Http\Request $request) {
            $user = $request->user();

            if ($user) {
                if ($user->isAdmin())
                    return \Illuminate\Cache\RateLimiting\Limit::none();

                // Distributors and Agents get higher limits (1000/min)
                if ($user->hasAnyRole(['distributor', 'agent'])) {
                    return \Illuminate\Cache\RateLimiting\Limit::perMinute(1000)->by($user->id);
                }

                // standard customers (300/min)
                return \Illuminate\Cache\RateLimiting\Limit::perMinute(300)->by($user->id);
            }

            // Guests (60/min)
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->ip());
        });

        // Specialized rate limiter for authentication
        \Illuminate\Support\Facades\RateLimiter::for ('auth', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });
    }
}
