export type Snippet = {
  id: string;
  text: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
};

const TITLE_MAX_LENGTH = 48;
const PREVIEW_MAX_LENGTH = 140;

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

function createSnippetId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getSnippetTitle(text: string): string {
  const firstLine = text
    .trim()
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0);

  if (!firstLine) {
    return "Untitled snippet";
  }

  return truncate(firstLine.trim(), TITLE_MAX_LENGTH);
}

export function getSnippetPreview(text: string): string {
  const preview = text.trim().replace(/\s+/g, " ");

  if (!preview) {
    return "No preview available.";
  }

  return truncate(preview, PREVIEW_MAX_LENGTH);
}

export function createSnippet(text: string): Snippet {
  const trimmedText = text.trim();
  const now = new Date().toISOString();

  return {
    id: createSnippetId(),
    text: trimmedText,
    title: getSnippetTitle(trimmedText),
    preview: getSnippetPreview(trimmedText),
    createdAt: now,
    updatedAt: now,
  };
}
