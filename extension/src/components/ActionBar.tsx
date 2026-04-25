type ActionBarProps = {
  canFormat: boolean;
  hasResult: boolean;
  isFormatting: boolean;
  onClearResult: () => void;
  onCopyResult: () => void;
  onFormat: () => void;
  onReplaceOriginal: () => void;
};

const secondaryButtonClass =
  "rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-400";

export function ActionBar({
  canFormat,
  hasResult,
  isFormatting,
  onClearResult,
  onCopyResult,
  onFormat,
  onReplaceOriginal,
}: ActionBarProps) {
  return (
    <div className="space-y-3">
      <button
        className="w-full rounded-lg bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        disabled={!canFormat}
        onClick={onFormat}
        type="button"
      >
        {isFormatting ? "Formatting..." : "Format"}
      </button>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          className={secondaryButtonClass}
          disabled={!hasResult}
          onClick={onCopyResult}
          type="button"
        >
          Copy
        </button>
        <button
          className={secondaryButtonClass}
          disabled={!hasResult}
          onClick={onReplaceOriginal}
          type="button"
        >
          Replace original
        </button>
        <button
          className={secondaryButtonClass}
          disabled={!hasResult}
          onClick={onClearResult}
          type="button"
        >
          Clear result
        </button>
      </div>
    </div>
  );
}
