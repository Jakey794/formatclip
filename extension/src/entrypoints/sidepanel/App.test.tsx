import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

beforeEach(() => {
  Object.defineProperty(globalThis, "chrome", {
    configurable: true,
    value: {
      runtime: { lastError: undefined },
      storage: {
        local: {
          get: vi.fn((_key, callback) => callback({})),
          remove: vi.fn((_key, callback) => callback()),
          set: vi.fn((_items, callback) => callback()),
        },
      },
    },
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("FormatClip side panel", () => {
  it("renders one descriptive H1 and labelled inputs", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("No snippets yet.")).toBeTruthy(),
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "FormatClip" }),
    ).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Add snippet" })).toBeTruthy();
  });

  it("uses a single-column layout that remains usable at narrow widths", () => {
    globalThis.innerWidth = 280;
    render(<App />);

    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add snippet" })).toBeTruthy();
  });
});
