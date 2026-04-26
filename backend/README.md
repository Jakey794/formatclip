# FormatClip Backend

FastAPI backend for FormatClip. It exposes a health check and a text formatting
endpoint with a mock formatter by default plus optional Groq or OpenAI formatting.

## Setup

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
```

## Run

```bash
uvicorn app.main:app --reload
```

## Formatter Provider

Mock mode is the default and requires no configuration:

```bash
FORMATCLIP_PROVIDER=mock
```

Groq is the recommended real LLM provider for the local demo. To enable it, set:

```bash
FORMATCLIP_PROVIDER=groq
FORMATCLIP_MODEL=openai/gpt-oss-20b
GROQ_API_KEY=your_groq_key
```

OpenAI is also supported. To enable it, set:

```bash
FORMATCLIP_PROVIDER=openai
FORMATCLIP_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your_key
```

The extension sends the selected snippet text and whatever instruction is typed in
the formatting box to `POST /format`. The selected provider receives both values
and must return the same response shape.

If provider configuration is missing or the provider call fails, the backend falls
back to the mock formatter so the local demo keeps working.

## Test

```bash
pytest
```

## Lint And Format

```bash
ruff check .
ruff format .
```

## API Contract

### `GET /health`

Returns:

```json
{
  "status": "ok",
  "service": "formatclip-backend"
}
```

### `POST /format`

Request:

```json
{
  "text": "messy copied text here",
  "instruction": "turn into clean bullet points"
}
```

Response:

```json
{
  "formatted_text": "- Messy copied text here",
  "detected_type": "notes",
  "changes_made": ["cleaned structure", "converted to bullets"]
}
```

The `/format` response schema is the same for mock, Groq, and OpenAI.
