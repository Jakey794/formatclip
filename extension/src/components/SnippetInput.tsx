import { useState } from "react";

type SnippetInputProps = {
  onAddSnippet: (text: string) => Promise<unknown>;
};

export function SnippetInput({ onAddSnippet }: SnippetInputProps) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedText) {
      return;
    }

    const snippet = await onAddSnippet(trimmedText);

    if (snippet) {
      setText("");
    }
  }

  return (
    <form
      aria-label="Add snippet"
      className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="snippet-input"
        className="text-xs font-medium uppercase tracking-wide text-stone-500"
      >
        New snippet
      </label>
      <textarea
        id="snippet-input"
        className="mt-3 min-h-28 w-full resize-y rounded-md border border-stone-300 bg-white p-3 text-sm leading-6 text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text here."
        value={text}
      />
      <button
        className="mt-3 w-full rounded-lg bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        disabled={!trimmedText}
        type="submit"
      >
        Add Snippet
      </button>
    </form>
  );
}
