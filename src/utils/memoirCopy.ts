import { LOCAL_USER_ADDR } from "@src/utils/constants";
import type { MemoirInterface } from "@src/store/slices/anthologySlice";

/**
 * Snapshot of a memoir for the local user's own anthology. Provenance changes
 * to the local sentinel; the title, content and timestamp are preserved.
 */
export const buildCopiedMemoir = (
  memoir: MemoirInterface
): MemoirInterface => ({
  ...memoir,
  sender: LOCAL_USER_ADDR,
});
