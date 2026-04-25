import type { Snippet } from "./snippets";

const STORAGE_KEY = "formatclip.snippets.v1";

function isSnippet(value: unknown): value is Snippet {
  if (!value || typeof value !== "object") {
    return false;
  }

  const snippet = value as Record<string, unknown>;

  return (
    typeof snippet.id === "string" &&
    typeof snippet.text === "string" &&
    typeof snippet.title === "string" &&
    typeof snippet.preview === "string" &&
    typeof snippet.createdAt === "string" &&
    typeof snippet.updatedAt === "string"
  );
}

function getLastError(): Error | null {
  const message = chrome.runtime.lastError?.message;

  return message ? new Error(message) : null;
}

export function getStoredSnippets(): Promise<Snippet[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(STORAGE_KEY, (items) => {
      const error = getLastError();

      if (error) {
        reject(error);
        return;
      }

      const storedValue = items[STORAGE_KEY];

      if (!Array.isArray(storedValue)) {
        resolve([]);
        return;
      }

      resolve(storedValue.filter(isSnippet));
    });
  });
}

export function saveStoredSnippets(snippets: Snippet[]): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: snippets }, () => {
      const error = getLastError();

      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export function clearStoredSnippets(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(STORAGE_KEY, () => {
      const error = getLastError();

      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
