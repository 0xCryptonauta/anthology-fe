import { useEffect, useId, useState } from "react";

/**
 * Single-playback registry: only one registered embed can be active
 * (playing) at a time — activating one deactivates every other.
 *
 * Module-level (not context) so every embed on the page participates
 * regardless of which skin/component tree renders it.
 */

let activeEmbedId: string | null = null;
const listeners = new Set<(activeId: string | null) => void>();

export const setActiveEmbed = (id: string | null) => {
  activeEmbedId = id;
  listeners.forEach((listener) => listener(activeEmbedId));
};

export const getActiveEmbed = () => activeEmbedId;

export const subscribeEmbedPlayback = (
  listener: (activeId: string | null) => void
) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useEmbedPlayback = () => {
  const id = useId();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return subscribeEmbedPlayback((activeId) => {
      if (activeId !== id) setIsActive(false);
    });
  }, [id]);

  const activate = () => {
    setActiveEmbed(id);
    setIsActive(true);
  };

  const deactivate = () => {
    setIsActive(false);
    if (getActiveEmbed() === id) setActiveEmbed(null);
  };

  return { isActive, activate, deactivate };
};
