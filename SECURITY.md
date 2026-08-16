# Security Policy

## Supported Versions

Security fixes are applied to the latest release on `main`.

| Version | Supported |
| --- | --- |
| 1.x | Yes |
| < 1.0 | No |

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability. Use the
repository's **Security** tab and select **Report a vulnerability** to create a
private GitHub security advisory.

Include affected versions, reproduction steps, expected impact, and any safe
proof of concept. Do not include real API keys, private snippets, or unrelated
personal data. You can expect an initial acknowledgement within seven days.

## Security Boundaries

FormatClip is designed for a local backend on loopback, not an unauthenticated
public API. A public deployment requires a separate threat model, authentication,
rate limiting, abuse controls, secret management, monitoring, and privacy review.
