<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class SetAppUrl {
    public function handle($request, Closure $next) {
        URL::forceRootUrl(config('app.url'));
        Log::info('Request headers: ', $request->headers->all());

        return $next($request);
    }
}
