from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import FormatRequest, FormatResponse
from app.services.formatter_service import format_text

app = FastAPI(title="FormatClip Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"^chrome-extension://.*$",
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
