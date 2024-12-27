<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param array|string $roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $roles)
    {
        $roles = explode('|', $roles);

        // Проверяем наличие одной из указанных ролей
        if (!$request->user()->hasAnyRole($roles)) {
            return response()->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
