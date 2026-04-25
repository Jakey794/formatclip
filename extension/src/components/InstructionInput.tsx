export const DEFAULT_FORMAT_INSTRUCTION =
  "Clean this text into clear, reusable formatting while preserving the original meaning.";

type InstructionInputProps = {
  instruction: string;
  onInstructionChange: (instruction: string) => void;
  onUseDefaultInstruction: () => void;
};

export function InstructionInput({
  instruction,
  onInstructionChange,
  onUseDefaultInstruction,
}: InstructionInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label
          className="text-xs font-medium uppercase tracking-wide text-stone-500"
          htmlFor="format-instruction"
        >
          Formatting instruction
        </label>
        <button
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
          disabled={instruction === DEFAULT_FORMAT_INSTRUCTION}
          onClick={onUseDefaultInstruction}
          type="button"
        >
          Use default format
        </button>
      </div>
      <textarea
        className="mt-3 min-h-24 w-full resize-y rounded-md border border-stone-300 bg-white p-3 text-sm leading-6 text-stone-800 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        id="format-instruction"
        onChange={(event) => onInstructionChange(event.target.value)}
        placeholder="Example: Turn this into clean bullet points"
        value={instruction}
      />
    </div>
  );
}
