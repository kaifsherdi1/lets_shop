<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OtpController extends Controller
{
  protected $otpService;

  public function __construct(OtpService $otpService)
  {
    $this->otpService = $otpService;
  }

  /**
   * Verify the provided OTP.
   * Security: Max 5 attempts per 15 minutes per email (brute-force protection).
   * Without this, an attacker can try all 1,000,000 possible 6-digit codes.
   */
  public function verify(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'code'  => 'required|string|size:6',
      'type'  => 'required|string|in:registration,password_reset',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    // Rate limit: 5 failed attempts per 15 minutes per email
    $rateLimitKey = 'otp_attempts_' . sha1($request->email . $request->type);
    $maxAttempts  = 5;
    $decayMinutes = 15;

    if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($rateLimitKey, $maxAttempts)) {
      $seconds = \Illuminate\Support\Facades\RateLimiter::availableIn($rateLimitKey);
      return response()->json([
        'message' => "Too many failed attempts. Please wait {$seconds} seconds before trying again.",
      ], 429);
    }

    $isValid = $this->otpService->verifyOtp($request->email, $request->code, $request->type);

    if (!$isValid) {
      // Increment failure counter
      \Illuminate\Support\Facades\RateLimiter::hit($rateLimitKey, $decayMinutes * 60);

      return response()->json([
        'message' => 'Invalid or expired OTP. Please try again.',
      ], 400);
    }

    // Clear rate limit on success
    \Illuminate\Support\Facades\RateLimiter::clear($rateLimitKey);

    // If verification is for registration, mark user as verified
    if ($request->type === 'registration') {
      $user = \App\Models\User::where('email', $request->email)->first();
      if ($user) {
        $user->email_verified_at = now();
        $user->save();
      }
    }

    return response()->json([
      'message'  => 'OTP verified successfully.',
      'verified' => true
    ]);
  }

  /**
   * Resend a new OTP.
   * Security: Always returns 200 even if email doesn't exist (prevents email enumeration).
   */
  public function resend(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'type'  => 'required|string|in:registration,password_reset',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    // Security: only generate OTP if user actually exists — but always return same response
    // This prevents email enumeration (attacker can't tell if email is registered)
    $user = \App\Models\User::where('email', $request->email)->first();

    if ($user) {
      $this->otpService->generateOtp($request->email, $request->type, $user->id);
    }

    // Always return 200 — never reveal if email exists or not
    return response()->json([
      'message' => 'If an account exists with that email, a new OTP has been sent.',
    ]);
  }
}
