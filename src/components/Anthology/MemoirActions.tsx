import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { copyToClipboard } from "@src/utils/copyToClipboard";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { DeleteMemoir } from "./DeleteMemoir";
import { EditMemoir } from "./EditMemoir";

export const MemoirActions = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const { addToast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const shareText = memoir.title
    ? `${memoir.title}\n\n${memoir.content}`
    : memoir.content;

  const handleCopy = async () => {
    const copied = await copyToClipboard(shareText);
    addToast({
      title: copied ? "Copied to clipboard" : "Copy failed",
      content: copied
        ? "The memoir was copied to your clipboard"
        : "Could not access the clipboard",
      variant: copied ? "success" : "info",
      delay: 3000,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memoir.title || "Anthology memoir",
          text: shareText,
        });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }

    setShareOpen(true);
  };

  const shareLinks = [
    {
      name: "X",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}`,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        memoir.content
      )}&text=${encodeURIComponent(memoir.title)}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        memoir.content
      )}`,
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {isLocalAnthology(anthologyAddr) && (
        <EditMemoir
          anthologyAddr={anthologyAddr}
          index={index}
          memoir={memoir}
        />
      )}

      <span
        title="Copy memoir"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={handleCopy}
      >
        📋
      </span>

      <span
        title="Share memoir"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={handleShare}
      >
        📤
      </span>

      <DeleteMemoir anthologyAddr={anthologyAddr} index={index} />

      <Modal show={shareOpen} onHide={() => setShareOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            minWidth: "200px",
          }}
        >
          <span style={{ fontWeight: "bold", textAlign: "center" }}>
            Share memoir
          </span>

          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShareOpen(false)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#f7fafc",
                border: "1px solid #e2e8f0",
                color: "#2b6cb0",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </Modal>
    </div>
  );
};
