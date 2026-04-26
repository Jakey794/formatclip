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
  const isFormatting = resultState === "loading";
  const hasResult = resultState === "success";
  const canFormat = Boolean(
    selectedSnippet && instruction.trim() && !isFormatting,
  );

  function clearMessages() {
    setCopyMessage(null);
    setReplaceMessage(null);
    setActionErrorMessage(null);
  }

  function clearStaleFormattingState() {
    setResult(null);
    setErrorMessage(null);
    clearMessages();
    setResultState("empty");
  }

  function handleInstructionChange(nextInstruction: string) {
    setInstruction(nextInstruction);
    clearStaleFormattingState();
  }

  function handleUseDefaultInstruction() {
    setInstruction(DEFAULT_FORMAT_INSTRUCTION);
    clearStaleFormattingState();
  }

  async function handleFormat() {
    if (!selectedSnippet) {
      return;
    }

    const latestInstruction = instruction.trim();

    if (!latestInstruction || isFormatting) {
      return;
    }

    setResult(null);
    setErrorMessage(null);
    clearMessages();
    setResultState("loading");

    try {
      const formattedResult = await formatSnippet({
        text: selectedSnippet.text,
        instruction: latestInstruction,
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
      setCopyMessage("Copied to clipboard.");
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
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Formatting workspace
      </p>
      {selectedSnippet ? (
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              Selected snippet
            </p>
            <div className="mt-2 rounded-md border border-stone-200 bg-stone-50">
              <div className="border-b border-stone-200 px-3 py-2">
                <p className="truncate text-sm font-medium text-stone-800">
                  {selectedSnippet.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-stone-500">
                  {selectedSnippet.preview}
                </p>
              </div>
              <p className="max-h-36 overflow-auto whitespace-pre-wrap p-3 text-sm leading-6 text-stone-700">
                {selectedSnippet.text}
              </p>
            </div>
          </div>

          <InstructionInput
            instruction={instruction}
            onInstructionChange={handleInstructionChange}
            onUseDefaultInstruction={handleUseDefaultInstruction}
          />

          <ActionBar
            canFormat={canFormat}
            hasResult={hasResult}
            isFormatting={isFormatting}
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
        <p className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-500">
          Select a saved snippet to format it.
        </p>
      )}
    </section>
  );
}
