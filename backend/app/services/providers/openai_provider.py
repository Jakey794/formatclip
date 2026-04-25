import json
from typing import Any

from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas import FormatResponse

SYSTEM_PROMPT = (
    "You are FormatClip, a text formatting utility. Rewrite messy copied text into "
    "clean reusable output. Preserve the original meaning. Follow the user's "
    "formatting instruction. Return only JSON with keys formatted_text, "
    "detected_type, and changes_made."
)


class ProviderError(RuntimeError):
    pass


def format_with_openai(text: str, instruction: str) -> FormatResponse:
    settings = get_settings()
    if not settings.openai_api_key:
        raise ProviderError("OpenAI provider requires OPENAI_API_KEY.")

    try:
        from openai import OpenAI
    except ImportError as exc:
        raise ProviderError("OpenAI SDK is not installed.") from exc

    client = OpenAI(api_key=settings.openai_api_key)
    user_prompt = f"Instruction:\n{instruction}\n\nText:\n{text}"

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
        raise ProviderError("OpenAI returned an empty formatting response.")

    return _parse_response(content)


def _parse_response(content: str) -> FormatResponse:
    try:
        payload: Any = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ProviderError("OpenAI returned invalid JSON.") from exc

    try:
        return FormatResponse.model_validate(payload)
    except ValidationError as exc:
        raise ProviderError("OpenAI response did not match FormatResponse.") from exc
