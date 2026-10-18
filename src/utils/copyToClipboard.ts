/**
 * Copies text to the clipboard.
 * Prefers the async Clipboard API; falls back to the legacy
 * textarea + execCommand approach (older browsers / non-secure contexts).
 * Returns whether the copy succeeded.
 */
export const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch {
      // fall through to legacy approach
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
};
