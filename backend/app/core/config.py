import os

from pydantic import BaseModel

DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"
DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b"


class Settings(BaseModel):
    provider: str = "mock"
    model: str = DEFAULT_OPENAI_MODEL
    openai_api_key: str = ""
    groq_api_key: str = ""


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
    )
