# FormatClip

FormatClip is a Chrome extension productivity tool that saves messy copied text snippets locally and sends selected snippets to an LLM-backed FastAPI formatter when the user clicks Format.

## Problem

Copied text from notes, websites, emails, resumes, GitHub issues, logs, and chats is often messy before reuse. FormatClip gives users a small local workspace for cleaning that text without automatically watching the clipboard or reading webpages.

## Demo

[Demo video coming soon]

- Backend runs locally with FastAPI.
- Extension is loaded manually in Chrome as an unpacked extension.
- Mock formatter works by default.
- Optional Groq formatting is the recommended real LLM mode for the local demo.
- Optional OpenAI formatting is also supported when environment variables are configured.

## What it does

- Add or paste text snippets manually.
- Save snippets locally with chrome.storage.local.
- Select a saved snippet.
- Enter a custom formatting instruction or use the default format action.
- Send selected text and instruction to POST /format.
- Display formatted output, detected type, and changes made.
- Copy result.
- Replace original snippet.
- Delete snippets or clear all snippets.

## Architecture

```text
Chrome Side Panel Extension
  - WXT + React + TypeScript
  - Tailwind CSS
  - chrome.storage.local
  - Manual snippet input
  - Explicit Format button

        |
        | POST /format
        v

FastAPI Backend
  - GET /health
  - POST /format
  - Provider-agnostic formatter service
  - Mock provider by default
  - Optional Groq provider through environment variables
  - Optional OpenAI provider through environment variables
```

## Tech Stack

Frontend:

- Chrome Extension Manifest V3
- WXT
- React
- TypeScript
- Tailwind CSS
- Biome
- chrome.storage.local

Backend:

- FastAPI
- Pydantic
- Uvicorn
- Ruff
- pytest
- Groq provider
- Optional OpenAI provider
- Mock fallback formatter

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
python -m uvicorn app.main:app --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected:

```json
{"status":"ok","service":"formatclip-backend"}
```

Format request:

```bash
curl -X POST http://127.0.0.1:8000/format \
  -H "Content-Type: application/json" \
  -d '{"text":" uhh meeting notes login broken fix friday docs ","instruction":"turn into clean bullet points"}'
```

## Extension setup

```bash
cd extension
npm install
npm run build
```

Load in Chrome:

1. Open chrome://extensions
2. Enable Developer mode
3. Click Load unpacked
4. Select extension/.output/chrome-mv3
5. Open the FormatClip side panel

## Local demo workflow

1. Start backend.
2. Build/load extension.
3. Open side panel.
4. Paste messy snippet.
5. Add snippet.
6. Select snippet.
7. Use default instruction or custom instruction.
8. Click Format.
9. Review result.
10. Copy result or replace original snippet.

## API contract

GET /health returns:

```json
{
  "status": "ok",
  "service": "formatclip-backend"
}
```

POST /format accepts:

```json
{
  "text": "messy copied text here",
  "instruction": "turn into clean bullet points"
}
```

POST /format returns:

```json
{
  "formatted_text": "...",
  "detected_type": "notes",
  "changes_made": ["cleaned structure", "removed filler", "converted to bullets"]
}
```

## Provider configuration

Mock mode is default and requires no API key:

```bash
FORMATCLIP_PROVIDER=mock
```

Groq is the recommended real LLM mode for the local demo:

```bash
FORMATCLIP_PROVIDER=groq
FORMATCLIP_MODEL=llama-3.1-8b-instant
GROQ_API_KEY=your_groq_key_here
```

OpenAI is also supported:

```bash
FORMATCLIP_PROVIDER=openai
FORMATCLIP_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your_openai_key_here
```

If provider configuration is missing or a provider call fails, the backend logs the provider error and falls back to the mock formatter so the local demo keeps working.

## Privacy model

- Snippets are stored locally in chrome.storage.local.
- The extension does not monitor the clipboard.
- The extension does not read webpages.
- Text is sent to the backend only when the user clicks Format.
- No accounts or database are used.

## Out of scope

- Authentication
- User accounts
- Database persistence
- Sync across devices
- Automatic clipboard monitoring
- Automatic webpage reading
- Chrome Web Store publishing
- Payments
- Large web app dashboard
- Complex agent workflows

## Future improvements

- Hosted backend for easier demos.
- Formatting presets.
- Import/export snippets.
- Stronger provider response validation.
- Demo GIF/video.

## Development checks

Backend:

```bash
cd backend
source .venv/bin/activate
pytest
ruff format .
ruff check .
```

Extension:

```bash
cd extension
npm run format
npm run check
npm run build
```

## Status

Local MVP complete. Designed for a local recruiter demo using a manually loaded Chrome extension and local FastAPI backend with mock fallback plus optional Groq/OpenAI LLM formatting.
