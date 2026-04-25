import type { Snippet } from "../lib/snippets";
import { SnippetCard } from "./SnippetCard";

type SnippetListProps = {
  snippets: Snippet[];
  selectedSnippetId: string | null;
  onSelectSnippet: (id: string) => void;
};

export function SnippetList({
  snippets,
  selectedSnippetId,
  onSelectSnippet,
}: SnippetListProps) {
  return (
    <ul className="space-y-3">
      {snippets.map((snippet) => (
        <SnippetCard
          isSelected={snippet.id === selectedSnippetId}
          key={snippet.id}
          onSelect={onSelectSnippet}
          snippet={snippet}
        />
      ))}
    </ul>
  );
}
