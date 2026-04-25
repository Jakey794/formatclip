import type { FormatResponse } from "../lib/types";

export type ResultDisplayState = "empty" | "loading" | "success" | "error";

type ResultPanelProps = {
  errorMessage: string | null;
  result: FormatResponse | null;
  state: ResultDisplayState;
};

export function ResultPanel({ errorMessage, result, state }: ResultPanelProps) {
  const isError = state === "error";

  function renderContent() {
    if (state === "empty") {
      return "Your formatted result will appear here.";
    }

    if (state === "loading") {
      return "Formatting...";
    }

    if (state === "error") {
      return errorMessage ?? "Formatting failed. Please try again.";
    }

    if (!result) {
      return "Your formatted result will appear here.";
    }

    return (
      <div className="space-y-4">
        <p className="whitespace-pre-wrap">{result.formatted_text}</p>
        <div className="space-y-2 border-t border-stone-200 pt-3">
          <p>
            <span className="font-semibold text-stone-700">Detected type:</span>{" "}
            {result.detected_type}
          </p>
          <div>
            <p className="font-semibold text-stone-700">Changes made:</p>
            {result.changes_made.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.changes_made.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">No changes reported.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Formatted result">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Result
      </p>
      <div
        className={`mt-3 min-h-32 whitespace-pre-wrap rounded-md border p-3 text-sm leading-6 ${
          isError
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-stone-200 bg-stone-50 text-stone-600"
        }`}
      >
        {renderContent()}
      </div>
    </section>
  );
}
