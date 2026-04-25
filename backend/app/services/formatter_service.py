from app.core.config import get_settings
from app.schemas import FormatResponse
from app.services.providers.groq_provider import format_with_groq
from app.services.providers.mock_provider import format_with_mock
from app.services.providers.openai_provider import format_with_openai


def format_text(text: str, instruction: str) -> FormatResponse:
    provider = get_settings().provider

    if provider == "groq":
        try:
            return format_with_groq(text=text, instruction=instruction)
        except Exception:
            return format_with_mock(text=text, instruction=instruction)

    if provider == "openai":
        try:
            return format_with_openai(text=text, instruction=instruction)
        except Exception:
            return format_with_mock(text=text, instruction=instruction)

    return format_with_mock(text=text, instruction=instruction)
