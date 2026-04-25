# FormatClip Backend

Mock FastAPI backend for FormatClip. It exposes a health check and a mock text formatting endpoint while the provider integration is intentionally left out.

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

This backend is mock-only for now. It does not call OpenAI, Gemini, Groq, or any other real provider.
