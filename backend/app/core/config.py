import os

from pydantic import BaseModel


class Settings(BaseModel):
    provider: str = "mock"
    model: str = "gpt-4.1-mini"
    openai_api_key: str = ""


def get_settings() -> Settings:
    return Settings(
        provider=os.getenv("FORMATCLIP_PROVIDER", "mock").strip().lower() or "mock",
        model=os.getenv("FORMATCLIP_MODEL", "gpt-4.1-mini").strip() or "gpt-4.1-mini",
        openai_api_key=os.getenv("OPENAI_API_KEY", "").strip(),
    )
