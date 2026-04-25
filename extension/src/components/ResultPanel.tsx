export type ResultDisplayState = "empty" | "loading" | "success" | "error";

const RESULT_COPY: Record<ResultDisplayState, string> = {
  empty: "Your formatted result will appear here.",
  loading: "Formatting preview...",
  success:
    "Formatted result preview will appear here after backend integration.",
  error: "Formatting failed. Check the backend connection after integration.",
};

type ResultPanelProps = {
  state: ResultDisplayState;
};

export function ResultPanel({ state }: ResultPanelProps) {
  const isError = state === "error";

  return (
    <section aria-label="Formatted result">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Result
      </p>
      <p
        className={`mt-3 min-h-32 whitespace-pre-wrap rounded-md border p-3 text-sm leading-6 ${
          isError
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-stone-200 bg-stone-50 text-stone-600"
        }`}
      >
        {RESULT_COPY[state]}
      </p>
    </section>
  );
}
