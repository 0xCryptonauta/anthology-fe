import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ContractSelector } from "./ContractSelector";
import { Modal } from "./Modal";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { TitleEditor } from "@components/Factory/TitleEditor";
import { useToast } from "@components/Layout/Toast";
import { Address, MemoirContent } from "@src/types/common";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { addUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";
import { getOwnLocalAddresses } from "@src/utils/localMemoryPayload";
import { getBgClass } from "@src/utils/backgrounds";
import { parseContractTitle } from "@src/utils/parseContractsCategories";
import { useTranslation } from "@src/i18n/useTranslation";

/* 
  users: string[]; // Array of user addresses
  userContracts: { [key: string]: string[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: string]: string }; // Mapping of contract addresses to contract details (e.g., title)
*/

export const SharePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const localAnthology = useAppSelector((state) => state.localAnthology);

  const [selectedContract, setSelectedContract] = useState<Address | "">();
  const [showNewAnthology, setShowNewAnthology] = useState(false);
  const [openAfterCreate, setOpenAfterCreate] = useState(false);

  const title = searchParams.get("title") || undefined;
  const text = searchParams.get("text") || undefined;
  const url = searchParams.get("url") || undefined;
  const sharedContent =
    text && url
      ? text.includes(url)
        ? text
        : `${text}\n${url}`
      : text || url;

  const userTitles: MemoirContent[] = useMemo(
    () =>
      getOwnLocalAddresses(localAnthology).map((address, index) => ({
        address,
        title: localAnthology.contractsTitles[address] || "",
        originalIndex: index,
      })),
    [localAnthology]
  );

  const selectedRawTitle = selectedContract
    ? localAnthology.contractsTitles[selectedContract] || ""
    : "";
  const selectedTitle = selectedRawTitle
    ? parseContractTitle(selectedRawTitle).title
    : t("selector.untitled");

  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );
  const backgroundKey = selectedContract || title || url || "share";

  const handleCreateAnthology = (combinedTitle: string) => {
    const contract = generateLocalContractAddr();

    dispatch(
      addUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract,
        title: combinedTitle,
      })
    );

    addToast({
      title: t("share.anthologyCreated"),
      content: parseContractTitle(combinedTitle).title || combinedTitle,
      variant: "success",
      delay: 5000,
    });

    setShowNewAnthology(false);
    setOpenAfterCreate(true);
    setSelectedContract(contract);
  };

  return (
    <div
      className={
        categoryBackgroundsEnabled
          ? `${getBgClass(backgroundKey)} text-shadow-dark`
          : undefined
      }
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        border: "1px solid #30363d",
        width: "100%",
        maxWidth: "420px",
        padding: "16px",
        borderRadius: "12px",
        margin: "5px",
        boxSizing: "border-box",
        backgroundColor: categoryBackgroundsEnabled
          ? "transparent"
          : "#161b22",
      }}
    >
      <ContractSelector
        setSelectedContract={setSelectedContract}
        showUserSelect={false}
      />

      <button
        type="button"
        onClick={() => setShowNewAnthology(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          width: "100%",
          maxWidth: "350px",
          minHeight: "38px",
          padding: "8px 14px",
          borderRadius: "8px",
          border: "1px solid #30363d",
          backgroundColor: "#21262d",
          color: "#e6edf3",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "16px", lineHeight: 1 }}>
          +
        </span>
        {t("share.newAnthology")}
      </button>

      {selectedContract && (
        <p
          style={{
            margin: 0,
            maxWidth: "350px",
            textAlign: "center",
            fontSize: "13px",
            color: "#cbd5e1",
          }}
        >
          {t("share.addingTo")}{" "}
          <span
            translate="no"
            style={{ fontWeight: 600, color: "#f8fafc" }}
          >
            {selectedTitle}
          </span>
        </p>
      )}

      {selectedContract && (
        <AddMemoir
          key={selectedContract}
          contractAddr={selectedContract}
          title={title}
          content={sharedContent}
          initialOpen={openAfterCreate}
          onAutoOpened={() => setOpenAfterCreate(false)}
        />
      )}

      <Modal
        show={showNewAnthology}
        onHide={() => setShowNewAnthology(false)}
        placement="bottom"
        dialogLabel={t("share.newAnthology")}
        maxWidth="320px"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem 1rem",
            width: "100%",
            maxWidth: "320px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#111827",
              textAlign: "center",
            }}
          >
            {t("share.newAnthology")}
          </span>

          <TitleEditor
            userTitles={userTitles}
            submitLabel={t("share.createAnthology")}
            onSubmit={handleCreateAnthology}
          />
        </div>
      </Modal>
    </div>
  );
};
