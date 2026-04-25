import { useState } from "react";
import { formatSnippet } from "../lib/api";
import type { Snippet } from "../lib/snippets";
import type { FormatResponse } from "../lib/types";
import { ActionBar } from "./ActionBar";
import {
  DEFAULT_FORMAT_INSTRUCTION,
  InstructionInput,
} from "./InstructionInput";
import { type ResultDisplayState, ResultPanel } from "./ResultPanel";

type FormatPanelProps = {
  onReplaceSnippet: (id: string, newText: string) => Promise<void>;
  selectedSnippet: Snippet | null;
};

export function FormatPanel({
  onReplaceSnippet,
  selectedSnippet,
}: FormatPanelProps) {
  const [instruction, setInstruction] = useState(DEFAULT_FORMAT_INSTRUCTION);
  const [resultState, setResultState] = useState<ResultDisplayState>("empty");
  const [result, setResult] = useState<FormatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [replaceMessage, setReplaceMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(
    null,
  );
  const hasResult = resultState === "success";
  const canFormat = Boolean(
    selectedSnippet && instruction.trim() && resultState !== "loading",
  );

  function clearMessages() {
    setCopyMessage(null);
    setReplaceMessage(null);
    setActionErrorMessage(null);
  }

  async function handleFormat() {
    if (!canFormat) {
      return;
    }

    setResult(null);
    setErrorMessage(null);
    clearMessages();
    setResultState("loading");

    try {
      const formattedResult = await formatSnippet({
        text: selectedSnippet.text,
        instruction: instruction.trim(),
      });

      setResult(formattedResult);
      setResultState("success");
    } catch (formatError) {
      setErrorMessage(
        formatError instanceof Error
          ? formatError.message
          : "FormatClip could not format this snippet. Please try again.",
      );
      setResultState("error");
    }
  }

  async function handleCopyResult() {
    if (!result) {
      return;
    }

    clearMessages();

    try {
      await navigator.clipboard.writeText(result.formatted_text);
      setCopyMessage("Copied.");
    } catch {
      setActionErrorMessage(
        "Could not copy the formatted result. Please try again.",
      );
    }
  }

  async function handleReplaceOriginal() {
    if (!selectedSnippet || !result) {
      return;
    }

    clearMessages();

    try {
      await onReplaceSnippet(selectedSnippet.id, result.formatted_text);
      setReplaceMessage("Snippet replaced.");
    } catch {
      setActionErrorMessage("Could not replace the snippet. Please try again.");
    }
  }

  function handleClearResult() {
    setResult(null);
    setErrorMessage(null);
    clearMessages();
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
            onCopyResult={handleCopyResult}
            onFormat={handleFormat}
            onReplaceOriginal={handleReplaceOriginal}
          />

          {copyMessage || replaceMessage || actionErrorMessage ? (
            <p
              className={`text-sm font-medium ${
                actionErrorMessage ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {actionErrorMessage ?? copyMessage ?? replaceMessage}
            </p>
          ) : null}

          <ResultPanel
            errorMessage={errorMessage}
            result={result}
            state={resultState}
          />
        </div>
      ) : (
        <p className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-500">
          Select a saved snippet to format it.
        </p>
      )}
    </section>
  );
}
