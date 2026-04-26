import logging

from app.core.config import get_settings
from app.schemas import FormatResponse
from app.services.providers.groq_provider import format_with_groq
from app.services.providers.mock_provider import format_with_mock
from app.services.providers.openai_provider import format_with_openai

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def format_text(text: str, instruction: str) -> FormatResponse:
    provider = get_settings().provider
    logger.info("FormatClip provider selected: %s", provider)

    provider_formatters = {
        "groq": format_with_groq,
        "openai": format_with_openai,
    }

    if provider == "mock":
        return format_with_mock(text=text, instruction=instruction)

    formatter = provider_formatters.get(provider)
    if formatter is None:
        logger.warning(
            "FormatClip provider %s is not recognized; falling back to mock.",
            provider,
        )
        return format_with_mock(text=text, instruction=instruction)

    try:
        return formatter(text=text, instruction=instruction)
    except Exception as exc:
        logger.warning(
            "FormatClip provider %s failed; falling back to mock: %s",
            provider,
            exc,
        )
    return format_with_mock(text=text, instruction=instruction)
