import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { copyToClipboard } from "@src/utils/copyToClipboard";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { DeleteMemoir } from "./DeleteMemoir";
import { EditMemoir } from "./EditMemoir";
import { MoveMemoir } from "./MoveMemoir";

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
      icon: "/icons/x-icon.svg",
      color: "#000000",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}`,
    },
    {
      name: "WhatsApp",
      icon: "/icons/whatsapp-icon.svg",
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Telegram",
      icon: "/icons/telegram-icon.svg",
      color: "#26A5E4",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        memoir.content
      )}&text=${encodeURIComponent(memoir.title)}`,
    },
    {
      name: "Facebook",
      icon: "/icons/facebook-icon.svg",
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        memoir.content
      )}`,
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
      {isLocalAnthology(anthologyAddr) && (
        <>
          <EditMemoir
            anthologyAddr={anthologyAddr}
            index={index}
            memoir={memoir}
          />
          <MoveMemoir
            anthologyAddr={anthologyAddr}
            index={index}
            memoir={memoir}
          />
        </>
      )}

      <span
        title="Copy memoir"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={handleCopy}
      >
        <img
          src="/icons/copy-icon.svg"
          alt="Copy memoir"
          style={{ width: "18px", height: "18px", display: "block" }}
        />
      </span>

      <span
        title="Share memoir"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={handleShare}
      >
        <img
          src="/icons/share-icon.svg"
          alt="Share memoir"
          style={{ width: "18px", height: "18px", display: "block" }}
        />
      </span>

      <DeleteMemoir anthologyAddr={anthologyAddr} index={index} />

      <Modal show={shareOpen} onHide={() => setShareOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "10px",
            minWidth: "200px",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", textAlign: "center" }}>
            Share memoir
          </span>

          <div style={{ display: "flex", gap: "12px" }}>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Share on ${link.name}`}
                aria-label={`Share on ${link.name}`}
                onClick={() => setShareOpen(false)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: link.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  src={link.icon}
                  alt=""
                  style={{ width: "22px", height: "22px", display: "block" }}
                />
              </a>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
