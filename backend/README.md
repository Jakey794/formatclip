# FormatClip Backend

Local FastAPI service for the FormatClip Chrome extension. It exposes a health
check and a bounded text-formatting endpoint with a deterministic mock provider
plus optional OpenAI and Groq adapters.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

## Run

```bash
python -m uvicorn app.main:app --reload
```

The default Uvicorn bind address is loopback-only. Health and OpenAPI endpoints
are available at `http://127.0.0.1:8000/health` and
`http://127.0.0.1:8000/docs`.

## Configuration

Mock mode requires no secret:

```bash
FORMATCLIP_PROVIDER=mock
```

OpenAI and Groq modes use `OPENAI_API_KEY` and `GROQ_API_KEY` respectively.
See the repository `.env.example` for all supported settings.

`BACKEND_CORS_ORIGINS` configures ordinary web origins. During unpacked
development, valid Chrome extension origins are accepted. Set
`FORMATCLIP_EXTENSION_ORIGINS` to one or more exact comma-separated extension
origins when the installed extension ID is stable.

If an optional provider is missing configuration or fails, FormatClip logs the
provider error without snippet contents and falls back to the mock formatter.

## API Contract

- `GET /health` returns `{ "status": "ok", "service": "formatclip-backend" }`.
- `POST /format` requires non-empty `text` and `instruction` values.
- Text is limited to 20,000 characters and instructions to 2,000 characters.
- All providers return `formatted_text`, `detected_type`, and `changes_made`.

## Checks

```bash
pytest
ruff check .
ruff format --check .
pip-audit
```
