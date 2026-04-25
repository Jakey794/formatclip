from fastapi import FastAPI

from app.schemas import FormatRequest, FormatResponse
from app.services.formatter_service import format_text

app = FastAPI(title="FormatClip Backend")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "formatclip-backend"}


@app.post("/format", response_model=FormatResponse)
def format_clip(request: FormatRequest) -> FormatResponse:
    return format_text(text=request.text, instruction=request.instruction)
