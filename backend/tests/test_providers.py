import pytest

from app.schemas import FormatResponse
from app.services.formatter_service import format_text
from app.services.providers.groq_provider import _parse_response as parse_groq_response
from app.services.providers.mock_provider import format_with_mock
from app.services.providers.openai_provider import ProviderError, format_with_openai


def test_mock_provider_returns_expected_schema() -> None:
    response = format_with_mock(
        text="  uhh first task ; basically second task  ",
        instruction="turn into clean bullet points",
    )

    assert isinstance(response, FormatResponse)
    assert response.formatted_text == "- First task\n- Second task"
    assert response.detected_type == "notes"
    assert response.changes_made == [
        "cleaned structure",
        "removed filler",
        "converted to bullets",
    ]


def test_formatter_service_mock_provider_returns_expected_schema(monkeypatch) -> None:
    monkeypatch.setenv("FORMATCLIP_PROVIDER", "mock")

    response = format_text(
        text="meeting notes\numm follow up with sales",
        instruction="turn into clean bullet points",
    )

    assert isinstance(response, FormatResponse)
    assert response.formatted_text == "- Meeting notes\n- Follow up with sales"
    assert response.detected_type == "notes"
    assert isinstance(response.changes_made, list)


def test_openai_provider_missing_api_key_raises_clear_error(monkeypatch) -> None:
    monkeypatch.setenv("FORMATCLIP_PROVIDER", "openai")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    with pytest.raises(ProviderError, match="OPENAI_API_KEY"):
        format_with_openai(
            text="messy copied text",
            instruction="turn into clean bullet points",
        )


def test_formatter_service_openai_missing_api_key_falls_back_to_mock(
    monkeypatch,
) -> None:
    monkeypatch.setenv("FORMATCLIP_PROVIDER", "openai")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    response = format_text(
        text="uhh first task ; basically second task",
        instruction="turn into clean bullet points",
    )

    assert response.formatted_text == "- First task\n- Second task"
    assert response.detected_type == "notes"


def test_formatter_service_groq_missing_api_key_falls_back_to_mock(
    monkeypatch,
) -> None:
    monkeypatch.setenv("FORMATCLIP_PROVIDER", "groq")
    monkeypatch.delenv("GROQ_API_KEY", raising=False)

    response = format_text(
        text="uhh first task ; basically second task",
        instruction="turn into clean bullet points",
    )

    assert response.formatted_text == "- First task\n- Second task"
    assert response.detected_type == "notes"


def test_formatter_service_unknown_provider_falls_back_to_mock(monkeypatch) -> None:
    monkeypatch.setenv("FORMATCLIP_PROVIDER", "not-a-provider")

    response = format_text(
        text="umm follow up with sales",
        instruction="turn into clean bullet points",
    )

    assert response.formatted_text == "- Follow up with sales"
    assert response.detected_type == "notes"


def test_groq_json_parser_accepts_valid_json() -> None:
    response = parse_groq_response(
        """
        {
            "formatted_text": "- First task",
            "detected_type": "notes",
            "changes_made": ["converted to bullets"]
        }
        """
    )

    assert response == FormatResponse(
        formatted_text="- First task",
        detected_type="notes",
        changes_made=["converted to bullets"],
    )


def test_groq_json_parser_accepts_markdown_fenced_json() -> None:
    response = parse_groq_response(
        """```json
        {
            "formatted_text": "- First task",
            "detected_type": "notes",
            "changes_made": ["converted to bullets"]
        }
        ```"""
    )

    assert response.formatted_text == "- First task"
    assert response.detected_type == "notes"
    assert response.changes_made == ["converted to bullets"]


def test_groq_json_parser_rejects_invalid_json() -> None:
    with pytest.raises(ProviderError, match="Groq returned invalid JSON"):
        parse_groq_response("not json")
