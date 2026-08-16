from app.core.config import DEFAULT_CORS_ORIGINS, get_settings


def test_default_cors_origins_are_local_only(monkeypatch) -> None:
    monkeypatch.delenv("BACKEND_CORS_ORIGINS", raising=False)
    monkeypatch.delenv("FORMATCLIP_EXTENSION_ORIGINS", raising=False)

    settings = get_settings()

    assert settings.cors_origins == DEFAULT_CORS_ORIGINS
    assert settings.extension_origins == ()


def test_configured_origins_are_trimmed(monkeypatch) -> None:
    monkeypatch.setenv(
        "BACKEND_CORS_ORIGINS",
        "https://example.com, https://app.example.com ,",
    )
    monkeypatch.setenv(
        "FORMATCLIP_EXTENSION_ORIGINS",
        "chrome-extension://abcdefghijklmnopabcdefghijklmnop",
    )

    settings = get_settings()

    assert settings.cors_origins == (
        "https://example.com",
        "https://app.example.com",
    )
    assert settings.extension_origins == (
        "chrome-extension://abcdefghijklmnopabcdefghijklmnop",
    )
