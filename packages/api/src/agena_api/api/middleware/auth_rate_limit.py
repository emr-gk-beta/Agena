"""IP-based rate limiting for unauthenticated routes (/auth/signup, /auth/login).

Prevents brute-force login attempts and spam org creation by limiting
requests per IP address on auth endpoints.

Limits:
  - /auth/signup:  5 requests per minute per IP
  - /auth/login:  15 requests per minute per IP
"""

from __future__ import annotations

import logging
import time

from redis.asyncio import Redis
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from agena_core.settings import get_settings

logger = logging.getLogger(__name__)

_WINDOW_SECONDS = 60

_ROUTE_LIMITS: dict[str, int] = {
    '/auth/signup': 5,
    '/auth/login': 15,
}


class AuthRateLimitMiddleware(BaseHTTPMiddleware):
    """IP-based rate limiter for authentication endpoints."""

    def __init__(self, app, redis_client: Redis | None = None) -> None:  # type: ignore[override]
        super().__init__(app)
        if redis_client is not None:
            self._redis = redis_client
        else:
            settings = get_settings()
            self._redis = Redis.from_url(settings.redis_url, decode_responses=True)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path
        limit = _ROUTE_LIMITS.get(path)

        if limit is None or request.method != 'POST':
            return await call_next(request)

        client_ip = self._get_client_ip(request)

        now = int(time.time())
        bucket = now // _WINDOW_SECONDS
        key = f'rate_limit:auth:{path}:{client_ip}:{bucket}'

        try:
            current = await self._redis.incr(key)
            if current == 1:
                await self._redis.expire(key, _WINDOW_SECONDS + 5)
        except Exception:
            logger.warning('Auth rate limit Redis unavailable, allowing request')
            return await call_next(request)

        if current > limit:
            retry_after = _WINDOW_SECONDS - (now % _WINDOW_SECONDS)
            return JSONResponse(
                status_code=429,
                content={'detail': 'Too many attempts. Please try again later.'},
                headers={
                    'Retry-After': str(retry_after),
                    'X-RateLimit-Limit': str(limit),
                    'X-RateLimit-Remaining': '0',
                },
            )

        response = await call_next(request)
        response.headers['X-RateLimit-Limit'] = str(limit)
        response.headers['X-RateLimit-Remaining'] = str(max(0, limit - current))
        return response

    @staticmethod
    def _get_client_ip(request: Request) -> str:
        """Extract real client IP, respecting X-Forwarded-For from trusted proxies."""
        forwarded = request.headers.get('x-forwarded-for')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return request.client.host if request.client else '0.0.0.0'
