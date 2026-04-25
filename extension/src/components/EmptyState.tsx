export function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-6 text-stone-500">
      <p className="font-medium text-stone-700">No snippets yet.</p>
      <p className="mt-1">
        Paste messy notes, logs, emails, or resume text to start formatting.
      </p>
    </div>
  );
}
