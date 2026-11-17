import { useEffect, useRef, useState } from "react";
import {
  nextHeaderScrollState,
  type HeaderScrollState,
} from "@utils/headerVisibility";

/**
 * Semi-sticky header state: visible at the top, hides on downward scroll and
 * returns on the first upward gesture. Scroll work is rAF-throttled and the
 * listener is passive so momentum scrolling on mobile stays smooth.
 */
export const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);
  const stateRef = useRef<HeaderScrollState>({ hidden: false, anchorY: 0 });

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      const next = nextHeaderScrollState(stateRef.current, window.scrollY);
      const changed = next.hidden !== stateRef.current.hidden;
      stateRef.current = next;
      if (changed) setHidden(next.hidden);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { hidden };
};
