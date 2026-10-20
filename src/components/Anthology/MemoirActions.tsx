import { memo, useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { copyToClipboard } from "@src/utils/copyToClipboard";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { DeleteMemoir } from "./DeleteMemoir";
import { EditMemoir } from "./EditMemoir";
import { MoveMemoir } from "./MoveMemoir";
import { useTranslation } from "@src/i18n/useTranslation";

const MemoirActionsBase = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const shareText = memoir.title
    ? `${memoir.title}\n\n${memoir.content}`
    : memoir.content;

  const handleCopy = async () => {
    const copied = await copyToClipboard(shareText);
    addToast({
      title: copied ? t("memoir.copied") : t("memoir.copyFailed"),
      content: copied
        ? t("memoir.copiedDesc")
        : t("memoir.copyFailedDesc"),
      variant: copied ? "success" : "info",
      delay: 3000,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memoir.title || t("memoir.defaultShareTitle"),
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

      <button
        type="button"
        className="icon-button"
        title={t("memoir.copyTitle")}
        aria-label={t("memoir.copyTitle")}
        style={{ fontSize: "1rem" }}
        onClick={handleCopy}
      >
        <img
          src="/icons/copy-icon.svg"
          alt=""
          style={{ width: "18px", height: "18px", display: "block" }}
        />
      </button>

      <button
        type="button"
        className="icon-button"
        title={t("memoir.shareTitle")}
        aria-label={t("memoir.shareTitle")}
        style={{ fontSize: "1rem" }}
        onClick={handleShare}
      >
        <img
          src="/icons/share-icon.svg"
          alt=""
          style={{ width: "18px", height: "18px", display: "block" }}
        />
      </button>

      <DeleteMemoir
        anthologyAddr={anthologyAddr}
        index={index}
        memoir={memoir}
      />

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
            {t("memoir.shareTitle")}
          </span>

          <div style={{ display: "flex", gap: "12px" }}>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={t("memoir.shareOn", { name: link.name })}
                aria-label={t("memoir.shareOn", { name: link.name })}
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

export const MemoirActions = memo(MemoirActionsBase);
