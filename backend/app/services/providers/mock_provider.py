import re

from app.schemas import FormatResponse

FILLER_PATTERN = re.compile(r"\b(?:uhh|umm|um|uh|basically)\b[,\s]*", re.IGNORECASE)
SPACE_PATTERN = re.compile(r"[ \t]+")
SENTENCE_SPLIT_PATTERN = re.compile(r"(?<=[.!?])\s+")


def format_with_mock(text: str, instruction: str) -> FormatResponse:
    cleaned = _normalize_text(text)
    without_filler = _remove_filler(cleaned)
    bullets = _to_bullets(without_filler)

    return FormatResponse(
        formatted_text=bullets,
        detected_type=_detect_type(text=text, instruction=instruction),
        changes_made=["cleaned structure", "removed filler", "converted to bullets"],
    )


def _normalize_text(text: str) -> str:
    lines = [SPACE_PATTERN.sub(" ", line).strip() for line in text.strip().splitlines()]
    return "\n".join(line for line in lines if line)


def _remove_filler(text: str) -> str:
    cleaned_lines = []
    for line in text.splitlines():
        cleaned = FILLER_PATTERN.sub("", line).strip(" ,")
        cleaned = SPACE_PATTERN.sub(" ", cleaned).strip()
        if cleaned:
            cleaned_lines.append(cleaned)
    return "\n".join(cleaned_lines)


def _to_bullets(text: str) -> str:
    raw_items: list[str] = []
    for line in text.splitlines():
        stripped = re.sub(r"^\s*(?:[-*]|\d+[.)])\s*", "", line).strip()
        if not stripped:
            continue
        raw_items.extend(_split_line(stripped))

    bullets = [f"- {_sentence_case(item)}" for item in raw_items if item.strip()]
    return "\n".join(bullets) if bullets else ""


def _split_line(line: str) -> list[str]:
    if ";" in line:
        return [part.strip(" .") for part in line.split(";") if part.strip(" .")]
    if len(SENTENCE_SPLIT_PATTERN.findall(line)) > 0:
        return [
            part.strip() for part in SENTENCE_SPLIT_PATTERN.split(line) if part.strip()
        ]
    return [line.strip()]


def _sentence_case(value: str) -> str:
    value = value.strip()
    if not value:
        return value
    return f"{value[0].upper()}{value[1:]}"


def _detect_type(text: str, instruction: str) -> str:
    combined = f"{text} {instruction}".lower()
    if any(
        token in combined
        for token in ("dear ", "hello ", "regards", "subject:", "email")
    ):
        return "email"
    if any(token in combined for token in ("bug", "error", "issue", "broken", "repro")):
        return "issue"
    if any(
        token in combined
        for token in ("traceback", "exception", "warn", "debug", "log")
    ):
        return "log"
    if any(token in combined for token in ("note", "bullet", "meeting", "todo", "- ")):
        return "notes"
    return "text"
