import { Card } from "../Layout/Card";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";

import "./style.css";
import { Address, CurrentPaths, SkinType } from "@src/types/common";
import {
  CHAIN_SCAN_URL,
  DEFAULT_SKIN,
  LOCAL_USER_ADDR,
} from "@src/utils/constants";
import { QRCodeGenerator } from "../Layout/QRCodeGenerator";
import { copyToClipboard } from "@src/utils/copyToClipboard";
import { useToast } from "../Layout/Toast";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";
import {
  addManyMemoirsToUserLocalAnthology,
  addUserLocalAnthology,
  setDefaultSkin,
} from "@src/store/slices/localAnthologySlice";
import { removePadding } from "@src/utils/removePadding";
import { updateCurrentPath } from "@src/store/slices/userSlice";

interface AnthologyStateProps {
  contractAddr: Address;
}

export const AnthologyState: React.FC<AnthologyStateProps> = ({
  contractAddr,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const anthologyData = useAppSelector((state) => {
    try {
      return state.anthology[contractAddr] || null;
    } catch (error) {
      console.error("error in anthologyState", error);
      return null;
    }
  });

  const anthologyState = anthologyData?.anthologyState;
  const memoirs = anthologyData?.memoirs || [];

  const shareUrl = `${window.location.origin}/?contract=${contractAddr}`;

  const handleCopyShareLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      addToast({
        title: "Link copied",
        content: "Shareable anthology link copied to clipboard.",
        variant: "success",
        delay: 3000,
      });
    }
  };

  const handleCloneToLocal = () => {
    const newLocalAddr = generateLocalContractAddr();
    const title = anthologyState?.title || "Cloned Anthology";
    const cleanedSkin = anthologyState?.skin
      ? (removePadding(anthologyState.skin) as SkinType)
      : DEFAULT_SKIN;

    dispatch(
      addUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract: newLocalAddr,
        title,
      })
    );

    if (memoirs.length > 0) {
      dispatch(
        addManyMemoirsToUserLocalAnthology({
          contract: newLocalAddr,
          memoirs: memoirs.map((m) => ({
            sender: LOCAL_USER_ADDR,
            title: m.title,
            content: m.content,
            timestamp: String(m.timestamp),
          })),
        })
      );
    }

    dispatch(
      setDefaultSkin({
        contract: newLocalAddr,
        newDefaultSkin: cleanedSkin || DEFAULT_SKIN,
      })
    );

    const newPath = `contract/${newLocalAddr}` as CurrentPaths;
    dispatch(updateCurrentPath(newPath));
    window.history.pushState(
      { currentPath: newPath },
      "",
      window.location.pathname
    );

    addToast({
      title: "Saved to Private Memory",
      content: `${title} (${memoirs.length} memoirs) saved offline.`,
      variant: "success",
      delay: 4000,
    });
  };

  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        maxWidth: "380px",
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Card
        title="Anthology Address"
        content={contractAddr}
        contentHref={CHAIN_SCAN_URL + contractAddr}
      />

      <Card
        title="Share QR Code"
        content={<QRCodeGenerator text={shareUrl} />}
      />

      <Card
        title="Share Link"
        content={
          <span
            title="Copy shareable link"
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleCopyShareLink}
          >
            <img
              src="/icons/copy-icon.svg"
              alt="Copy link"
              style={{
                width: "20px",
                height: "20px",
                display: "block",
                filter: "invert(1)",
              }}
            />
          </span>
        }
      />

      <Card
        title="Save to Private Memory"
        content={
          <span
            title="Save an offline copy in Private Memory"
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={handleCloneToLocal}
          >
            💾
          </span>
        }
      />

      <Card title="Owner" content={anthologyState?.owner.toString()} />

      <Card title="Title" content={anthologyState?.title} />

      <Card
        title="Memoirs count"
        content={anthologyState?.currentMemoirCount.toString()}
      />

      <Card
        title="Total created"
        content={anthologyState?.totalCreatedMemoirs.toString()}
      />

      <Card
        title="Max memoirs"
        content={anthologyState?.maxMemoirs.toString()}
      />

      <Card
        title="Price per memoir"
        content={anthologyState?.memoirPrice.toString()}
      />

      <Card
        title="Token payment"
        content={anthologyState?.useERC20 ? "Enabled" : "Disabled"}
      />

      {anthologyState?.useERC20 && (
        <Card
          title="Token Address"
          content={anthologyState?.erc20Token.toString()}
        />
      )}

      <Card
        title="Moderation buffer"
        content={anthologyState?.useBuffer ? "Enabled" : "Disabled"}
      />

      <Card
        title="Whitelist only"
        content={anthologyState?.whitelistEnabled ? "Enabled" : "Disabled"}
      />

      <Card
        title="Default Skin"
        content={
          anthologyState?.skin
            ? removePadding(anthologyState.skin)
            : DEFAULT_SKIN
        }
      />
    </div>
  );
};
