# FormatClip Extension

FormatClip is a Chrome side panel extension for saving messy copied text snippets locally and sending selected snippets to a FastAPI formatter only when the user clicks Format.

## What this extension does

- Adds/pastes snippets manually.
- Stores snippets locally with chrome.storage.local.
- Lets the user select a snippet.
- Sends selected text + instruction to the local FastAPI backend.
- Displays formatted text, detected type, and changes made.
- Supports copy, replace original, delete, and clear all.

## Local backend requirement

The extension expects the backend to run at:

```text
http://127.0.0.1:8000
```

Start it from the repo root with:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

## Setup

From extension/:

```bash
npm install
npm run build
```

## Load in Chrome

1. Open chrome://extensions
2. Enable Developer mode
3. Click Load unpacked
4. Select extension/.output/chrome-mv3
5. Open the FormatClip side panel

## Development checks

```bash
npm run format
npm run check
npm run build
```

## Privacy and permissions

- Snippets stay local in chrome.storage.local.
- The extension does not monitor the clipboard.
- The extension does not read webpages.
- Text is sent to the backend only when the user clicks Format.
- No accounts or database are used.
- The extension uses narrow permissions only.

## Demo mode

This extension is designed for a local recruiter demo with a manually loaded Chrome extension and a local FastAPI backend.
