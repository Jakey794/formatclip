function App() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-5 py-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-normal">FormatClip</h1>
          <p className="text-sm leading-6 text-stone-600">
            Clean up messy copied text before reuse.
          </p>
        </header>

        <section
          aria-label="Current snippet"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Snippet
          </p>
          <p className="mt-3 min-h-24 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm leading-6 text-stone-500">
            Your copied text will appear here.
          </p>
        </section>

        <section
          aria-label="Format instructions"
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <label
            htmlFor="format-instructions"
            className="text-xs font-medium uppercase tracking-wide text-stone-500"
          >
            Instructions
          </label>
          <textarea
            id="format-instructions"
            className="mt-3 min-h-28 w-full resize-none rounded-md border border-stone-300 bg-white p-3 text-sm leading-6 text-stone-700 outline-none"
            placeholder="Describe how you want the snippet cleaned up."
            readOnly
          />
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
