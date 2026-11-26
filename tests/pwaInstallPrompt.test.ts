import { describe, expect, test } from "bun:test";
import {
  PWA_INSTALL_PROMPT_COOLDOWN_MS,
  shouldShowInstallPrompt,
} from "../src/utils/pwaInstallPrompt";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;

const base = {
  onHome: true,
  installed: false,
  canInstall: true,
  dismissedAt: null as number | null,
  now: NOW,
};

describe("shouldShowInstallPrompt", () => {
  test("shows when installable, not installed and never dismissed", () => {
    expect(shouldShowInstallPrompt(base)).toBe(true);
  });

  test("stays hidden away from the home page", () => {
    expect(shouldShowInstallPrompt({ ...base, onHome: false })).toBe(false);
  });

  test("stays hidden when the browser offers no install mechanism", () => {
    expect(shouldShowInstallPrompt({ ...base, canInstall: false })).toBe(false);
  });

  test("stays hidden once the app is installed", () => {
    expect(shouldShowInstallPrompt({ ...base, installed: true })).toBe(false);
  });

  test("respects the seven-day cooldown after a dismissal", () => {
    expect(
      shouldShowInstallPrompt({
        ...base,
        dismissedAt: NOW - (PWA_INSTALL_PROMPT_COOLDOWN_MS - 1),
      })
    ).toBe(false);

    expect(
      shouldShowInstallPrompt({
        ...base,
        dismissedAt: NOW - PWA_INSTALL_PROMPT_COOLDOWN_MS,
      })
    ).toBe(true);
  });

  test("uses a one-week cooldown", () => {
    expect(PWA_INSTALL_PROMPT_COOLDOWN_MS).toBe(7 * DAY);
  });
});
