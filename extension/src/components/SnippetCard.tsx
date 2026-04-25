import type { Snippet } from "../lib/snippets";

type SnippetCardProps = {
  snippet: Snippet;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function SnippetCard({
  snippet,
  isSelected,
  onSelect,
}: SnippetCardProps) {
  return (
    <li>
      <button
        aria-current={isSelected}
        className={`w-full rounded-lg border p-3 text-left shadow-sm transition ${
          isSelected
            ? "border-stone-950 bg-stone-100 ring-2 ring-stone-300"
            : "border-stone-200 bg-white hover:border-stone-400"
        }`}
        onClick={() => onSelect(snippet.id)}
        type="button"
      >
        <span className="block text-sm font-semibold text-stone-900">
          {snippet.title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-stone-600">
          {snippet.preview}
        </span>
        <time
          className="mt-2 block text-[11px] leading-4 text-stone-400"
          dateTime={snippet.createdAt}
        >
          {new Date(snippet.createdAt).toLocaleString()}
        </time>
      </button>
    </li>
  );
}
