from pydantic import BaseModel, ConfigDict, field_validator


class FormatRequest(BaseModel):
    text: str
    instruction: str

    @field_validator("text", "instruction")
    @classmethod
    def must_be_non_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must be non-empty")
        return value


class FormatResponse(BaseModel):
    formatted_text: str
    detected_type: str
    changes_made: list[str]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "formatted_text": "- First useful point\n- Second useful point",
                "detected_type": "notes",
                "changes_made": [
                    "cleaned structure",
                    "removed filler",
                    "converted to bullets",
                ],
            }
        }
    )
