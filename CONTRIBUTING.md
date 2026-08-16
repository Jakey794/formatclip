# Contributing to FormatClip

Thanks for improving FormatClip. Keep changes focused on its local-first text
formatting workflow and privacy model.

## Before Opening a Change

- Search existing issues and pull requests.
- Open an issue for behavior changes or new permissions before writing a large patch.
- Never include real API keys, private snippets, or personal browser data.
- Preserve the explicit user action required before text is sent to the backend.

## Local Checks

Run the backend checks from `backend/`:

```bash
pytest
ruff check .
ruff format --check .
pip-audit
```

Run the extension checks from `extension/`:

```bash
npm run check
npm test
npm run build
npm run check:bundle
npm audit --audit-level=high
```

## Pull Requests

Explain the user-visible change, privacy or permission impact, tests performed,
and screenshots for UI changes. Keep unrelated refactors out of the same pull
request. By contributing, you agree that your contribution is licensed under
the repository's MIT License.
