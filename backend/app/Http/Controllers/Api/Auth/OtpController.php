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
   */
  public function verify(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'code' => 'required|string|size:6',
      'type' => 'required|string|in:registration,password_reset',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $isValid = $this->otpService->verifyOtp($request->email, $request->code, $request->type);

    if (!$isValid) {
      return response()->json([
        'message' => 'Invalid or expired OTP. Please try again.'
      ], 400);
    }

    return response()->json([
      'message' => 'OTP verified successfully.',
      'verified' => true
    ]);
  }

  /**
   * Resend a new OTP.
   */
  public function resend(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'type' => 'required|string|in:registration,password_reset',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    // Check if user exists (optional, depends on security preference)
    // $user = User::where('email', $request->email)->first();

    $code = $this->otpService->generateOtp($request->email, $request->type);

    // In a real app, send the email here
    // Mail::to($request->email)->send(new OtpMail($code));

    return response()->json([
      'message' => 'A new OTP has been sent to your email.',
      'debug_code' => config('app.debug') ? $code : null
    ]);
  }
}
