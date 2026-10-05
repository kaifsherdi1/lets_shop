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
        // API routes are registered once, in bootstrap/app.php (withRouting).
        $this->configureRateLimiting();
    }

    protected function configureRateLimiting(): void
    {
        \Illuminate\Support\Facades\RateLimiter::for ('api', function (\Illuminate\Http\Request $request) {
            // Bearer tokens are resolved by the sanctum guard, which has not run
            // yet when the throttle middleware evaluates the limit.
            $user = $request->user('sanctum');

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

            // Guests (120/min — a storefront page makes several calls, and
            // shoppers behind one office/mobile NAT share an IP)
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(120)->by($request->ip());
        });

        // Specialized rate limiter for authentication
        \Illuminate\Support\Facades\RateLimiter::for ('auth', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });
    }
}
