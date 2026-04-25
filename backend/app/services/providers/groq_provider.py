import json
from typing import Any

from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas import FormatResponse
from app.services.providers.openai_provider import ProviderError

SYSTEM_PROMPT = (
    "You are FormatClip, a text formatting utility. Rewrite messy copied text into "
    "clean reusable output. Preserve the original meaning. Follow the user's "
    "formatting instruction exactly. Return only JSON with keys formatted_text, "
    "detected_type, and changes_made. Do not explain your response outside JSON."
)


def format_with_groq(text: str, instruction: str) -> FormatResponse:
    settings = get_settings()
    if not settings.groq_api_key:
        raise ProviderError("Groq provider requires GROQ_API_KEY.")

    try:
        from groq import Groq
    except ImportError as exc:
        raise ProviderError("Groq SDK is not installed.") from exc

    client = Groq(api_key=settings.groq_api_key)
    user_prompt = (
        "Format the copied text according to the user's instruction.\n\n"
        f"Instruction:\n{instruction}\n\n"
        f"Text:\n{text}"
    )

    response = client.chat.completions.create(
        model=settings.model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise ProviderError("Groq returned an empty formatting response.")

    return _parse_response(content)


def _parse_response(content: str) -> FormatResponse:
    try:
        payload: Any = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ProviderError("Groq returned invalid JSON.") from exc

    try:
        return FormatResponse.model_validate(payload)
    except ValidationError as exc:
        raise ProviderError("Groq response did not match FormatResponse.") from exc
