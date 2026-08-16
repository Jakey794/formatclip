# FormatClip Privacy Statement

Effective date: August 15, 2026

FormatClip is a local-first Chrome extension. It does not include accounts,
analytics, advertising, telemetry, or a hosted FormatClip database.

## Data Stored on the Device

Snippets, titles, previews, and timestamps are stored in
`chrome.storage.local`. Users can delete an individual snippet or clear all
FormatClip snippets from the side panel. Uninstalling the extension also removes
its local extension storage according to Chrome's behavior.

## Data Sent Over the Network

FormatClip does not monitor the clipboard or read webpages. It sends the selected
snippet and formatting instruction to the configured backend only after the user
clicks **Format**. The default backend is the user's own loopback service at
`http://127.0.0.1:8000`.

Mock mode makes no external provider request. If the user configures OpenAI or
Groq, the local backend sends the selected text and instruction to that provider
under the user's own account and the provider's applicable privacy terms. API
keys remain in the backend environment and are not stored by the extension.

## Sharing and Retention

The project does not sell or share user data. The project maintainer receives no
snippet data unless a user independently includes it in a bug report or other
communication. Users should remove private text and secrets from reports.

## Changes

Material privacy changes will be documented in the repository changelog and in
this file. Changes that introduce new collection, permissions, or hosted data
flows require a new privacy and security review.

## Contact

Use the repository's public issue tracker for non-sensitive privacy questions.
Report security vulnerabilities privately through the repository's Security tab.
