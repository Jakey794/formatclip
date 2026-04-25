from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_format_accepts_valid_text_and_instruction() -> None:
    response = client.post(
        "/format",
        json={
            "text": "  uhh messy note one.   basically messy note two. ",
            "instruction": "turn into clean bullet points",
        },
    )

    assert response.status_code == 200


def test_format_returns_expected_fields() -> None:
    response = client.post(
        "/format",
        json={
            "text": "meeting notes\numm follow up with sales",
            "instruction": "turn into clean bullet points",
        },
    )

    body = response.json()

    assert "formatted_text" in body
    assert "detected_type" in body
    assert "changes_made" in body
    assert isinstance(body["changes_made"], list)


def test_format_returns_visibly_cleaned_result() -> None:
    response = client.post(
        "/format",
        json={
            "text": "  uhh first task ;  basically second task  ",
            "instruction": "turn into clean bullet points",
        },
    )

    body = response.json()

    assert body["formatted_text"] == "- First task\n- Second task"
    assert body["detected_type"] == "notes"
    assert "removed filler" in body["changes_made"]
    assert "converted to bullets" in body["changes_made"]


def test_format_rejects_missing_text() -> None:
    response = client.post(
        "/format",
        json={"instruction": "turn into clean bullet points"},
    )

    assert response.status_code == 422


def test_format_rejects_missing_instruction() -> None:
    response = client.post(
        "/format",
        json={"text": "messy copied text here"},
    )

    assert response.status_code == 422


def test_format_rejects_empty_text() -> None:
    response = client.post(
        "/format",
        json={"text": "   ", "instruction": "turn into clean bullet points"},
    )

    assert response.status_code == 422


def test_format_rejects_empty_instruction() -> None:
    response = client.post(
        "/format",
        json={"text": "messy copied text here", "instruction": ""},
    )

    assert response.status_code == 422
