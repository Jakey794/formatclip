import json
from typing import Any

from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas import FormatResponse
from app.services.providers.openai_provider import ProviderError

SYSTEM_PROMPT = (
    "You are FormatClip, a formatting utility, not a chatbot. Preserve meaning. "
    "Follow the user's formatting instruction exactly. Return only JSON with: "
    "formatted_text: string, detected_type: string, changes_made: string[]. "
    "Do not include markdown, prose, or explanations outside the JSON object."
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
    user_prompt = f"Instruction:\n{instruction}\n\nText:\n{text}"

    response = client.chat.completions.create(
        model=settings.model,
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
    content = _strip_markdown_json_fence(content)
    try:
        payload: Any = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ProviderError(f"Groq returned invalid JSON: {exc.msg}.") from exc

    try:
        return FormatResponse.model_validate(payload)
    except ValidationError as exc:
        fields = ", ".join(
            _format_error_location(error["loc"]) for error in exc.errors()
        )
        raise ProviderError(
            f"Groq response did not match FormatResponse schema: {fields}."
        ) from exc


def _strip_markdown_json_fence(content: str) -> str:
    stripped = content.strip()
    if not stripped.startswith("```"):
        return stripped

    lines = stripped.splitlines()
    if not lines:
        return stripped

    opening_fence = lines[0].strip().removeprefix("```").strip().lower()
    if opening_fence not in {"", "json"}:
        return stripped

    if len(lines) > 1 and lines[-1].strip() == "```":
        return "\n".join(lines[1:-1]).strip()

    return stripped


def _format_error_location(location: tuple[str | int, ...]) -> str:
    return ".".join(str(part) for part in location)
