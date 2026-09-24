from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.utils.logger import logger


async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Return a stable public error contract and preserve request tracing."""

    if isinstance(exc, RequestValidationError):
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        payload: dict[str, object] = {
            "detail": "Validation error",
            "errors": exc.errors(),
        }
    else:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        payload = {"detail": "Internal server error"}
        logger.opt(exception=exc).error(
            "Unhandled exception during {} {}",
            request.method,
            request.url.path,
        )

    request_id = getattr(request.state, "request_id", None)
    if request_id:
        payload["request_id"] = request_id

    return JSONResponse(status_code=status_code, content=payload)
