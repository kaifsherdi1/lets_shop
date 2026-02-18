<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
  /**
   * Handle an incoming request.
   */
  public function handle(Request $request, Closure $next, $permission): Response
  {
    if (!$request->user() || !$request->user()->hasPermission($permission)) {
      return response()->json([
        'message' => 'Unauthorized. Permission required: ' . $permission
      ], 403);
    }

    return $next($request);
  }
}
