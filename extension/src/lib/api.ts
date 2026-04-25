import { API_BASE_URL } from "./config";
import type { FormatRequest, FormatResponse } from "./types";

const BACKEND_UNREACHABLE_MESSAGE =
  "Could not reach the local FormatClip backend. Start FastAPI on http://127.0.0.1:8000 and try again.";

function isFormatResponse(value: unknown): value is FormatResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.formatted_text === "string" &&
    typeof response.detected_type === "string" &&
    Array.isArray(response.changes_made) &&
    response.changes_made.every((change) => typeof change === "string")
  );
}

export async function formatSnippet(
  request: FormatRequest,
): Promise<FormatResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/format`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: request.text,
        instruction: request.instruction,
      }),
    });
  } catch {
    throw new Error(BACKEND_UNREACHABLE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(
      "FormatClip could not format this snippet. Check the text and instruction, then try again.",
    );
  }

  const data: unknown = await response.json();

  if (!isFormatResponse(data)) {
    throw new Error("FormatClip received an unexpected backend response.");
  }

  return data;
}
