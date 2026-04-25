import { EmptyState } from "../../components/EmptyState";
import { FormatPanel } from "../../components/FormatPanel";
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
    replaceSnippet,
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

    if (
      window.confirm(
        "Are you sure you want to delete all saved snippets? This cannot be undone.",
      )
    ) {
      await clearSnippets();
    }
  }

  const secondaryDangerButtonClass =
    "rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-400";

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 py-5">
        <header className="space-y-2 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-normal">FormatClip</h1>
          <p className="text-sm leading-6 text-stone-600">
            Save messy copied text, then format it into clean reusable output.
          </p>
          <p className="border-t border-stone-100 pt-2 text-xs leading-5 text-stone-500">
            Snippets stay local. Text is sent only when you click Format.
          </p>
        </header>

        <SnippetInput onAddSnippet={addSnippet} />

        <section
          aria-label="Saved snippets"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Saved snippets
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

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              className={secondaryDangerButtonClass}
              disabled={!selectedSnippetId}
              onClick={handleDeleteSelected}
              type="button"
            >
              Delete selected
            </button>
            <button
              className={secondaryDangerButtonClass}
              disabled={!snippets.length}
              onClick={handleClearAll}
              type="button"
            >
              Clear all
            </button>
          </div>
        </section>

        <FormatPanel
          onReplaceSnippet={replaceSnippet}
          selectedSnippet={selectedSnippet}
        />

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}

export default App;
