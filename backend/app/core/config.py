import os

from pydantic import BaseModel

DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"
DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant"
DEFAULT_CORS_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
)


class Settings(BaseModel):
    provider: str = "mock"
    model: str = DEFAULT_OPENAI_MODEL
    openai_api_key: str = ""
    groq_api_key: str = ""
    cors_origins: tuple[str, ...] = DEFAULT_CORS_ORIGINS
    extension_origins: tuple[str, ...] = ()


def _read_csv(name: str, default: tuple[str, ...] = ()) -> tuple[str, ...]:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return tuple(value.strip() for value in raw_value.split(",") if value.strip())


def get_settings() -> Settings:
    provider = os.getenv("FORMATCLIP_PROVIDER", "mock").strip().lower() or "mock"
    model = os.getenv("FORMATCLIP_MODEL", "").strip()

    if not model:
        model = DEFAULT_GROQ_MODEL if provider == "groq" else DEFAULT_OPENAI_MODEL

    return Settings(
        provider=provider,
        model=model,
        openai_api_key=os.getenv("OPENAI_API_KEY", "").strip(),
        groq_api_key=os.getenv("GROQ_API_KEY", "").strip(),
        cors_origins=_read_csv("BACKEND_CORS_ORIGINS", DEFAULT_CORS_ORIGINS),
        extension_origins=_read_csv("FORMATCLIP_EXTENSION_ORIGINS"),
    )
