/** Pixels from the top where the header is always shown. */
export const HEADER_TOP_BAND = 64;
/** Movement needed before a direction change flips the header. */
export const HEADER_SCROLL_DELTA = 8;

export interface HeaderScrollState {
  hidden: boolean;
  anchorY: number;
}

/**
 * Tracks the semi-sticky header across scroll events.
 *
 * The header is pinned near the top, hides once the user scrolls down past
 * `HEADER_TOP_BAND`, and comes back on the first upward gesture. Re-anchoring
 * on every flip means slow flicks accumulate until they cross the delta
 * instead of being dismissed as noise.
 */
export const nextHeaderScrollState = (
  state: HeaderScrollState,
  rawScrollY: number
): HeaderScrollState => {
  const scrollY = Math.max(0, rawScrollY);

  if (scrollY <= HEADER_TOP_BAND) {
    return { hidden: false, anchorY: scrollY };
  }

  const delta = scrollY - state.anchorY;

  if (delta > HEADER_SCROLL_DELTA) {
    return { hidden: true, anchorY: scrollY };
  }

  if (delta < -HEADER_SCROLL_DELTA) {
    return { hidden: false, anchorY: scrollY };
  }

  return state;
};
