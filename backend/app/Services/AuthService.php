<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
  /**
   * Authenticate a user and return a token.
   */
  public function login(array $data)
  {
    $user = User::where('email', $data['email'])->first();

    if (!$user || !Hash::check($data['password'], $user->password)) {
      throw ValidationException::withMessages([
        'email' => ['Invalid credentials.'],
      ]);
    }

    if ($user->status !== 'active') {
      throw ValidationException::withMessages([
        'status' => ['Your account is ' . $user->status],
      ]);
    }

    // Delete old tokens for this device if provided
    if (isset($data['device_name'])) {
      $user->tokens()->where('name', $data['device_name'])->delete();
    }

    $deviceName = $data['device_name'] ?? 'auth_token';
    $token = $user->createToken($deviceName)->plainTextToken;

    return [
      'user' => $user->load('role'),
      'token' => $token,
    ];
  }

  /**
   * Register a new user.
   */
  public function register(array $data)
  {
  // Registration logic is handled in RegisterController for now
  // but can be moved here for better abstraction.
  }
}
