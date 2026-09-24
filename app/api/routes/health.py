import time

from fastapi import APIRouter

from app.config import settings


router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": "2.0.0-public",
        "environment": settings.APP_ENV,
        "demo_mode": settings.DEMO_MODE,
        "timestamp": int(time.time()),
        "components": {
            "synthetic_dataset": {"status": "ok"},
            "external_model": {"status": "optional"},
            "commerce_adapter": {"status": "optional"},
        },
    }


@router.get("/ping")
async def ping():
    return {"status": "ok", "message": "pong"}
