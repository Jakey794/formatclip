import { useEffect, useMemo, useState } from "react";
import { createSnippet, type Snippet } from "../lib/snippets";
import {
  clearStoredSnippets,
  getStoredSnippets,
  saveStoredSnippets,
} from "../lib/storage";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function getNextSelectedSnippetId(
  snippets: Snippet[],
  deletedSnippetId: string,
  selectedSnippetId: string | null,
): string | null {
  if (deletedSnippetId !== selectedSnippetId) {
    return selectedSnippetId;
  }

  const deletedIndex = snippets.findIndex(
    (snippet) => snippet.id === deletedSnippetId,
  );
  const remainingSnippets = snippets.filter(
    (snippet) => snippet.id !== deletedSnippetId,
  );

  return (
    remainingSnippets[deletedIndex]?.id ??
    remainingSnippets[deletedIndex - 1]?.id ??
    null
  );
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSnippets() {
      try {
        const storedSnippets = await getStoredSnippets();

        if (!isMounted) {
          return;
        }

        setSnippets(storedSnippets);
        setSelectedSnippetId(storedSnippets[0]?.id ?? null);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setSnippets([]);
          setSelectedSnippetId(null);
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSnippets();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedSnippet = useMemo(
    () => snippets.find((snippet) => snippet.id === selectedSnippetId) ?? null,
    [selectedSnippetId, snippets],
  );

  async function addSnippet(text: string): Promise<Snippet | null> {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return null;
    }

    const snippet = createSnippet(trimmedText);
    const nextSnippets = [snippet, ...snippets];

    try {
      await saveStoredSnippets(nextSnippets);
      setSnippets(nextSnippets);
      setSelectedSnippetId(snippet.id);
      setError(null);
      return snippet;
    } catch (saveError) {
      setError(getErrorMessage(saveError));
      return null;
    }
  }

  function selectSnippet(id: string) {
    setSelectedSnippetId(id);
  }

  async function deleteSnippet(id: string): Promise<void> {
    const nextSnippets = snippets.filter((snippet) => snippet.id !== id);
    const nextSelectedSnippetId = getNextSelectedSnippetId(
      snippets,
      id,
      selectedSnippetId,
    );

    try {
      await saveStoredSnippets(nextSnippets);
      setSnippets(nextSnippets);
      setSelectedSnippetId(nextSelectedSnippetId);
      setError(null);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function clearSnippets(): Promise<void> {
    try {
      await clearStoredSnippets();
      setSnippets([]);
      setSelectedSnippetId(null);
      setError(null);
    } catch (clearError) {
      setError(getErrorMessage(clearError));
    }
  }

  return {
    snippets,
    selectedSnippetId,
    selectedSnippet,
    isLoading,
    error,
    addSnippet,
    selectSnippet,
    deleteSnippet,
    clearSnippets,
  };
}
