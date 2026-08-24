<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserProfileController extends Controller
{
    /**
     * GET /api/profile
     * Returns the authenticated user's profile with role details.
     */
    public function show(Request $request)
    {
        $user = $request->user()->load('role');

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'full_name'         => $user->full_name,
                'email'             => $user->email,
                'phone'             => $user->phone,
                'role'              => $user->role?->slug ?? 'customer',
                'status'            => $user->status,
                'email_verified_at' => $user->email_verified_at,
                'created_at'        => $user->created_at,
            ],
        ]);
    }

    /**
     * PUT /api/profile
     * Update the authenticated user's profile (name, phone).
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'      => 'sometimes|required|string|max:100',
            'full_name' => 'sometimes|nullable|string|max:150',
            'phone'     => 'sometimes|nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => [
                'id'                => $user->id,
                'name'              => $user->name,
                'full_name'         => $user->full_name,
                'email'             => $user->email,
                'phone'             => $user->phone,
                'role'              => $user->role?->slug ?? 'customer',
                'status'            => $user->status,
                'email_verified_at' => $user->email_verified_at,
                'created_at'        => $user->created_at,
            ],
        ]);
    }

    /**
     * POST /api/profile/change-password
     * Allow authenticated user to change their password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update(['password' => $request->new_password]);

        // Revoke all existing tokens for security (force re-login on other devices)
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json([
            'message' => 'Password changed successfully. Other sessions have been logged out.',
        ]);
    }
}
