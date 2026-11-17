import type { LocalId } from "@src/types/connect";

export const LOCAL_ID_RE = /^1x[0-9a-f]{20}$/;

export const generateLocalId = (): LocalId => {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return `1x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    ""
  )}` as LocalId;
};

export const isLocalId = (value: unknown): value is LocalId =>
  typeof value === "string" && LOCAL_ID_RE.test(value);
