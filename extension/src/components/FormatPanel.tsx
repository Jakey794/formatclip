import { useState } from "react";
import type { Snippet } from "../lib/snippets";
import { ActionBar } from "./ActionBar";
import {
  DEFAULT_FORMAT_INSTRUCTION,
  InstructionInput,
} from "./InstructionInput";
import { type ResultDisplayState, ResultPanel } from "./ResultPanel";

type FormatPanelProps = {
  selectedSnippet: Snippet | null;
};

export function FormatPanel({ selectedSnippet }: FormatPanelProps) {
  const [instruction, setInstruction] = useState(DEFAULT_FORMAT_INSTRUCTION);
  const [resultState, setResultState] = useState<ResultDisplayState>("empty");
  const hasResult = resultState === "success";
  const canFormat = Boolean(selectedSnippet && instruction.trim());

  function handleFormat() {
    if (!canFormat) {
      return;
    }

    setResultState("success");
  }

  function handleClearResult() {
    setResultState("empty");
  }

  return (
    <section
      aria-label="Formatting workspace"
      className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
    >
      {selectedSnippet ? (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Formatting Workspace
            </p>
            <p className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
              {selectedSnippet.text}
            </p>
          </div>

          <InstructionInput
            instruction={instruction}
            onInstructionChange={setInstruction}
            onUseDefaultInstruction={() =>
              setInstruction(DEFAULT_FORMAT_INSTRUCTION)
            }
          />

          <ActionBar
            canFormat={canFormat}
            hasResult={hasResult}
            onClearResult={handleClearResult}
            onFormat={handleFormat}
          />

          <ResultPanel state={resultState} />
        </div>
      ) : (
        <p className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-500">
          Select a saved snippet to format it.
        </p>
      )}
    </section>
  );
}
