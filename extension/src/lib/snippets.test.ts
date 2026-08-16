import { describe, expect, it } from "vitest";
import { createSnippet, getSnippetPreview, getSnippetTitle } from "./snippets";

describe("snippet helpers", () => {
  it("uses the first non-empty line as the title", () => {
    expect(getSnippetTitle("\n  Release notes\nShip the fix")).toBe(
      "Release notes",
    );
  });

  it("normalizes whitespace in previews", () => {
    expect(getSnippetPreview("First line\n\n second   line")).toBe(
      "First line second line",
    );
  });

  it("creates a normalized snippet with timestamps", () => {
    const snippet = createSnippet("  First task\nSecond task  ");

    expect(snippet.text).toBe("First task\nSecond task");
    expect(snippet.title).toBe("First task");
    expect(snippet.preview).toBe("First task Second task");
    expect(snippet.id).toBeTruthy();
    expect(Date.parse(snippet.createdAt)).not.toBeNaN();
    expect(snippet.updatedAt).toBe(snippet.createdAt);
  });
});
