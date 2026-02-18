<?php

namespace App\Services;

use App\Models\OtpVerification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
  /**
   * Generate and store an OTP for a user or email.
   */
  public function generateOtp(string $email, string $type = 'registration', ?int $userId = null): string
  {
    // Delete any existing codes for this email and type
    OtpVerification::where('email', $email)
      ->where('type', $type)
      ->delete();

    // Generate a 6-digit code
    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    // Store the new code
    OtpVerification::create([
      'user_id' => $userId,
      'email' => $email,
      'code' => $code, // In production, hash this code
      'type' => $type,
      'expires_at' => Carbon::now()->addMinutes(10),
    ]);

    return $code;
  }

  /**
   * Verify the provided OTP.
   */
  public function verifyOtp(string $email, string $code, string $type = 'registration'): bool
  {
    $verification = OtpVerification::where('email', $email)
      ->where('code', $code)
      ->where('type', $type)
      ->where('expires_at', '>', Carbon::now())
      ->whereNull('verified_at')
      ->first();

    if (!$verification) {
      return false;
    }

    // Mark as verified
    $verification->update([
      'verified_at' => Carbon::now()
    ]);

    return true;
  }
}
