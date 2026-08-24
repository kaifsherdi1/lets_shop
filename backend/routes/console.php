<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Scheduled Cleanup Jobs ─────────────────────────────────────────────────────
// Prune expired OTP codes every hour (security hygiene — don't leave old codes in DB)
Schedule::call(function () {
    \App\Models\OtpVerification::where('expires_at', '<', now())->delete();
})->hourly()->name('prune-expired-otps');

// Prune expired Sanctum tokens daily (tokens older than 7 days per sanctum.expiration config)
Schedule::command('sanctum:prune-expired --hours=168')->daily()->name('prune-expired-tokens');

