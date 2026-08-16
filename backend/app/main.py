from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.schemas import FormatRequest, FormatResponse
from app.services.formatter_service import format_text

settings = get_settings()
allowed_origins = [*settings.cors_origins, *settings.extension_origins]

app = FastAPI(
    title="FormatClip Backend",
    summary="Local text-formatting API for the FormatClip Chrome extension.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=(
        None if settings.extension_origins else r"^chrome-extension://[a-p]{32}$"
    ),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "formatclip-backend"}


@app.post("/format", response_model=FormatResponse)
def format_clip(request: FormatRequest) -> FormatResponse:
    return format_text(text=request.text, instruction=request.instruction)
