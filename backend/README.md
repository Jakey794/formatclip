# FormatClip Backend

FastAPI backend for FormatClip. It exposes a health check and a text formatting
endpoint with a mock formatter by default and optional OpenAI formatting.

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
FORMATCLIP_MODEL=gpt-4.1-mini
OPENAI_API_KEY=
```

OpenAI is optional. To enable it, set:

```bash
FORMATCLIP_PROVIDER=openai
FORMATCLIP_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your_key
```

If OpenAI configuration is missing or the provider call fails, the backend falls
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

The `/format` response schema is the same for both providers.
