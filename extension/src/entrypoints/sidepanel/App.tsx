import { EmptyState } from "../../components/EmptyState";
import { SnippetInput } from "../../components/SnippetInput";
import { SnippetList } from "../../components/SnippetList";
import { useSnippets } from "../../hooks/useSnippets";

function App() {
  const {
    snippets,
    selectedSnippetId,
    selectedSnippet,
    isLoading,
    error,
    addSnippet,
    selectSnippet,
    deleteSnippet,
    clearSnippets,
  } = useSnippets();

  async function handleDeleteSelected() {
    if (!selectedSnippetId) {
      return;
    }

    await deleteSnippet(selectedSnippetId);
  }

  async function handleClearAll() {
    if (!snippets.length) {
      return;
    }

    if (window.confirm("Clear all saved snippets?")) {
      await clearSnippets();
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-5 py-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-normal">FormatClip</h1>
          <p className="text-sm leading-6 text-stone-600">
            Clean up messy copied text before reuse.
          </p>
        </header>

        <SnippetInput onAddSnippet={addSnippet} />

        <section
          aria-label="Saved snippets"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Snippets
            </p>
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              {snippets.length} saved
            </span>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <p className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-500">
                Loading snippets...
              </p>
            ) : snippets.length ? (
              <SnippetList
                onSelectSnippet={selectSnippet}
                selectedSnippetId={selectedSnippetId}
                snippets={snippets}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        <section
          aria-label="Selected snippet"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Selected preview
          </p>
          <p className="mt-3 min-h-24 whitespace-pre-wrap rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
            {selectedSnippet?.text ?? "Select a snippet to preview it."}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              className="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
              disabled={!selectedSnippetId}
              onClick={handleDeleteSelected}
              type="button"
            >
              Delete selected
            </button>
            <button
              className="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
              disabled={!snippets.length}
              onClick={handleClearAll}
              type="button"
            >
              Clear all
            </button>
          </div>
        </section>

        <section
          aria-label="Formatted result"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Result
          </p>
          <p className="mt-3 min-h-32 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-500">
            Formatted text will appear here.
          </p>
        </section>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled
          className="rounded-lg bg-stone-300 px-4 py-3 text-sm font-semibold text-stone-500"
        >
          Format
        </button>

        <p className="mt-auto border-t border-stone-200 pt-4 text-xs leading-5 text-stone-500">
          Snippets stay local. Text is sent only when you click Format.
        </p>
      </div>
    </main>
  );
}

export default App;
