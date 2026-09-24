import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.middleware.error_handler import error_handler
from app.api.routes import demo, health
from app.config import settings
from app.utils.logger import logger


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("Starting {} in {} mode", settings.APP_NAME, settings.APP_ENV)
    yield
    logger.info("Shutting down {}", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    description="Evidence-grounded ecommerce analytics and AI decision support",
    version="2.0.0-public",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Process-Time", "X-Request-ID"],
)


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    started = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{time.perf_counter() - started:.4f}"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return await error_handler(request, exc)


app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(demo.router, prefix="/api/demo", tags=["public-demo"])


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "healthy",
        "version": "2.0.0-public",
        "data_mode": "synthetic",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
