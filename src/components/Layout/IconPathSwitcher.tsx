import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { toggleIsIconToLocal } from "@src/store/slices/dappSlice";
import { useAccount } from "wagmi";
import { useTranslation } from "@src/i18n/useTranslation";

export const IconPathSwitcher = () => {
  const { t } = useTranslation();
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { isConnected } = useAccount();

  if (!isConnected) return null;

  const handleToggle = (toLocal: boolean) => {
    if (toLocal === isIconToLocal) return;

    dispatch(toggleIsIconToLocal());
    addToast({
      title: t("iconPath.changedTitle"),
      content: toLocal
        ? t("iconPath.changedLocal")
        : t("iconPath.changedWeb3"),
      variant: "success",
      delay: 3000,
    });
  };

  const options = [
    { local: true, label: t("iconPath.local") },
    { local: false, label: t("iconPath.web3") },
  ];

  return (
    <div
      role="group"
      aria-label={t("iconPath.title")}
      style={{
        display: "inline-flex",
        border: "1px solid #30363d",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {options.map((option) => {
        const active = option.local === isIconToLocal;

        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => handleToggle(option.local)}
            style={{
              minHeight: "40px",
              padding: "7px 12px",
              border: "none",
              backgroundColor: active ? "#238636" : "#21262d",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
