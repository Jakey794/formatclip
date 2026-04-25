# FormatClip Demo Script

Goal: Show messy copied text becoming clean reusable output in under 2 minutes.

## Setup before recording

Start backend:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

Build/load extension:

```bash
cd extension
npm run build
```

Open chrome://extensions, reload FormatClip, and open the side panel.

## Demo script

1. Open FormatClip in the Chrome side panel.

Say:
"This is FormatClip, a small Chrome extension workspace for cleaning up messy copied text."

2. Paste this messy snippet:

```text
team sync notes uhh login page is still broken after the auth change. sarah said api returning 500 sometimes. mike thinks token refresh maybe busted. need fix before friday demo. also docs are out of date and onboarding steps wrong. next: jacob check frontend error state, sarah check backend logs, mike update docs.
```

Say:
"I can paste messy notes into the local snippet workspace."

3. Click Add snippet.

Say:
"The snippet is saved locally in the extension."

4. Select the snippet.

Say:
"Now I select the snippet I want to format."

5. Use the default instruction or type:

```text
turn this into clean action-oriented meeting notes
```

Say:
"I can use the default formatting action or give a custom instruction."

6. Click Format.

Say:
"The extension sends only this selected text and instruction to the FastAPI backend."

7. Show the result.

Say:
"The backend returns formatted text, a detected type, and a short list of changes made."

8. Click Copy.

Say:
"I can copy the cleaned result for reuse."

9. Click Replace original.

Say:
"I can also replace the original messy snippet with the cleaned version, and it stays saved locally."

10. Mention privacy.

Say:
"Privacy-wise, snippets are stored in chrome.storage.local. The extension does not monitor the clipboard, does not read webpages, and only sends text to the backend when I click Format. There are no accounts and no database."

11. Mention backend mode.

Say:
"The backend uses a provider-agnostic formatter service. Mock mode works by default for local demos, and an OpenAI provider can be enabled with environment variables."

## Optional second demo snippet

```text
BUG checkout fails prod
steps click checkout with 3 items then apply discount code SAVE10 then pay
expected order success
actual spinner forever then 504
logs: payment-service timeout after 30000ms, retry count 3, upstream stripe gateway latency high
started after deploy 4:22pm
impact users can't complete purchase maybe all discount code orders
```

Instruction:

```text
turn this into a structured bug report
```

## What not to say

Do not say:

- "This is deployed."
- "This is on the Chrome Web Store."
- "This is production-ready."
- "It automatically watches the clipboard."
- "It reads webpages."

## One-sentence closer

"FormatClip shows browser extension development, API design, LLM integration, clean UX states, and a privacy-conscious local-first product loop."
