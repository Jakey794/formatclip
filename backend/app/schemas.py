from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

MAX_TEXT_LENGTH = 20_000
MAX_INSTRUCTION_LENGTH = 2_000
MAX_FORMATTED_TEXT_LENGTH = 40_000
MAX_CHANGES = 50
ChangeDescription = Annotated[str, StringConstraints(max_length=500)]


class FormatRequest(BaseModel):
    text: str = Field(max_length=MAX_TEXT_LENGTH)
    instruction: str = Field(max_length=MAX_INSTRUCTION_LENGTH)

    @field_validator("text", "instruction")
    @classmethod
    def must_be_non_empty(cls, value: str) -> str:
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("must be non-empty")
        return stripped_value


class FormatResponse(BaseModel):
    formatted_text: str = Field(max_length=MAX_FORMATTED_TEXT_LENGTH)
    detected_type: str = Field(max_length=100)
    changes_made: list[ChangeDescription] = Field(max_length=MAX_CHANGES)

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
