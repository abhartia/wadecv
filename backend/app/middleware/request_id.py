"""Assign a request id to every request and propagate it to logs + responses.

A client can supply its own X-Request-ID (useful for correlating from an
upstream proxy / CDN); otherwise we mint a new UUID4. The id is:

- stored in a ContextVar so structlog includes it in every log line
- echoed in the response as X-Request-ID so a client sees what to reference
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.logging_config import request_id_ctx


class RequestIDMiddleware(BaseHTTPMiddleware):
    header_name = "X-Request-ID"

    async def dispatch(self, request: Request, call_next) -> Response:
        incoming = request.headers.get(self.header_name)
        rid = incoming if incoming and len(incoming) <= 128 else uuid.uuid4().hex
        token = request_id_ctx.set(rid)
        try:
            response = await call_next(request)
        finally:
            request_id_ctx.reset(token)
        response.headers[self.header_name] = rid
        return response
