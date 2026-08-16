# FormatClip Extension

Chrome Manifest V3 side-panel extension built with WXT, React, TypeScript, and
Tailwind CSS.

## What It Does

- Saves manually entered snippets in `chrome.storage.local`.
- Sends only the selected text and instruction to the local backend after the
  user clicks **Format**.
- Supports copy, replace, delete, and clear actions.
- Opens from the toolbar action and adapts to narrow side-panel widths.

The extension does not monitor the clipboard, inject content scripts, read web
pages, collect analytics, or include API keys.

## Develop

```bash
npm ci
npm run dev
```

Start the backend separately at `http://127.0.0.1:8000`.

## Build and Load

```bash
npm run build
```

Then load `.output/chrome-mv3` from `chrome://extensions` using **Load unpacked**.

## Checks

```bash
npm run format
npm run check
npm test
npm run build
npm run check:bundle
npm audit --audit-level=high
```
