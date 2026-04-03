"""Request ID middleware for log correlation.

Assigns a unique ``X-Request-ID`` to every request (or propagates one
supplied by the client / reverse-proxy).  The ID is stored on
``request.state.request_id`` so other middleware and route handlers can
include it in log entries.
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Inject / propagate X-Request-ID on every request."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get('x-request-id') or uuid.uuid4().hex
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers['X-Request-ID'] = request_id
        return response
