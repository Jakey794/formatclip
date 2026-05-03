<img width="1506" height="820" alt="Screenshot 2026-05-03 at 5 56 11 PM" src="https://github.com/user-attachments/assets/8c43ecf6-dffa-49a3-bec1-85c1f76f8c96" />
# FormatClip

Chrome Manifest V3 extension for saving snippets, formatting selected text, and reusing cleaned outputs through a side-panel workflow.

FormatClip combines a React/TypeScript Chrome extension with a FastAPI backend. It supports local snippet storage, custom formatting instructions, copy/replace workflows, and provider-swappable LLM formatting.

## Why I Built This

Copied text from notes, websites, emails, resumes, GitHub issues, logs, and chats is often messy before reuse. FormatClip gives users a small local workspace for cleaning that text without automatically monitoring the clipboard or reading webpages.

The goal is to make text cleanup fast, reusable, and privacy-conscious.

## Features

- Chrome Manifest V3 side panel
- Add, select, edit, delete, and persist snippets
- Format selected snippets with custom instructions
- Copy formatted results
- Replace original snippets with formatted output
- FastAPI backend with typed request/response contracts
- Provider-swappable formatter service
- Mock formatter by default for local demos
- Optional Groq and OpenAI provider modes
- Local browser storage using `chrome.storage.local`
- Tested frontend and backend workflows

## Tech Stack

**Extension:** Chrome Manifest V3, WXT, React, TypeScript, Tailwind CSS  
**Backend:** FastAPI, Python, Pydantic, Uvicorn  
**AI / Formatting:** Mock formatter, Groq provider, optional OpenAI provider  
**Testing / Quality:** pytest, Ruff, Biome  
**Storage:** `chrome.storage.local`


## Project Structure

```text
formatclip/
├── backend/
│   ├── app/
│   ├── tests/
│   └── pyproject.toml
├── extension/
│   ├── src/
│   ├── package.json
│   └── wxt.config.ts
├── .env.example
└── README.md
```

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

## Local Setup

### Backend

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

Expected response:

```json
{
  "status": "ok",
  "service": "formatclip-backend"
}
```

### Extension

```bash
cd extension
npm install
npm run build
```

Load in Chrome:

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click Load unpacked
4. Select `extension/.output/chrome-mv3`
5. Open the FormatClip side panel

## Local Demo Workflow

1. Start the backend.
2. Build and load the extension.
3. Open the side panel.
4. Paste a messy snippet.
5. Add the snippet.
6. Select the snippet.
7. Use the default instruction or enter a custom instruction.
8. Click Format.
9. Review the formatted result.
10. Copy the result or replace the original snippet.

## API Contract

`GET /health` returns:

```json
{
  "status": "ok",
  "service": "formatclip-backend"
}
```

`POST /format` accepts:

```json
{
  "text": " uhh meeting notes login broken fix friday docs ",
  "instruction": "turn into clean bullet points"
}
```

`POST /format` returns:

```json
{
  "formatted_text": "- Meeting notes\n- Login is broken\n- Fix target: Friday\n- Update documentation",
  "detected_type": "notes",
  "changes_made": [
    "cleaned structure",
    "removed filler",
    "converted to bullets"
  ]
}
```

Example request:

```bash
curl -X POST http://127.0.0.1:8000/format \
  -H "Content-Type: application/json" \
  -d '{"text":" uhh meeting notes login broken fix friday docs ","instruction":"turn into clean bullet points"}'
```

## Provider Configuration

Mock mode is the default and requires no API key:

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

## Privacy Model

- Snippets are stored locally in `chrome.storage.local`.
- The extension does not monitor the clipboard.
- The extension does not read webpages automatically.
- Text is sent to the backend only when the user clicks Format.
- No accounts or database are used.

## Testing and Development Checks

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

## What I Learned

- Chrome extensions need a clear privacy model.
- Local browser storage is better than monitoring the clipboard.
- Provider-swappable AI backends make the app easier to demo and extend.
- A mock fallback is useful for testing without relying on external APIs.
- Small AI tools are easier to evaluate when the workflow is narrow and explicit.

## Out of Scope

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

## Status

Local MVP complete. Designed for a local recruiter demo using a manually loaded Chrome extension and local FastAPI backend with mock fallback plus optional Groq/OpenAI LLM formatting.

Future improvements could include:

- hosted backend for easier demos
- formatting presets
- import/export snippets
- stronger provider response validation
- demo GIF/video

## License

MIT License.
