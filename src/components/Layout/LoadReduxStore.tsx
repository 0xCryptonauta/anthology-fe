import { useState } from "react";
import { Modal } from "./Modal";
import { loadJsonAsObj } from "@src/utils/loadJsonAsObj";
import {
  LoadedJson,
  validateJsonContentType,
} from "@src/utils/validateJsonContentType";
import { useAppDispatch } from "@src/store/utils/hooks";
import { LOCAL_USER_PATH, LOCAL_USER_ADDR } from "@src/utils/constants";
import {
  addAnthologiesToLocalMemory,
  addManyMemoirsToUserLocalAnthology,
  addUserLocalAnthology,
  setDefaultSkin,
  setManyDefaultSkin,
  updateLocalContractTitles,
  updateLocalUserContracts,
} from "@src/store/slices/localAnthologySlice";
import {
  Address,
  AnthologyType,
  ContractTitlesType,
  CurrentPaths,
  SkinType,
  UserContractsType,
} from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { useNavigate } from "react-router-dom";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import {
  updateContractTitles,
  updateUserContracts,
  updateUsers,
} from "@src/store/slices/factorySlice";
import { useToast } from "./Toast";

export const LoadReduxStore = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { addToast } = useToast();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [isValidJson, setIsValidJson] = useState<boolean | undefined>(
    undefined
  );
  const [hasDiscovery, setHasDiscovery] = useState(false);
  const [hasLocal, setHasLocal] = useState(false);
  const [isOneAnthology, setIsOneAnthology] = useState(false);

  const [loadDiscoveries, setLoadDiscoveries] = useState(false);
  const [loadLocalMemory, setLoadLocalMemory] = useState(false);

  const [loadedJsonState, setLoadedJsonState] = useState<LoadedJson>({});

  const handleJsonLoad = async () => {
    setIsValidJson(undefined);
    setHasDiscovery(false);
    setHasLocal(false);
    setIsOneAnthology(false);
    setLoadedJsonState({});

    const loadedState = await loadJsonAsObj();
    const {
      hasDiscovery: hasDiscoveryJson,
      hasLocal: hasLocalJson,
      isOneAnthology: isOneAnthologyJson,
    } = validateJsonContentType(loadedState);

    setHasDiscovery(hasDiscoveryJson);
    setHasLocal(hasLocalJson);
    setIsOneAnthology(isOneAnthologyJson);

    if (hasDiscoveryJson || hasLocalJson || isOneAnthologyJson) {
      setIsValidJson(true);
      setLoadedJsonState(loadedState);
    } else {
      setIsValidJson(false);
    }
  };

  const addOneAnthologyToLocal = () => {
    dispatch(
      addUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract: loadedJsonState.anthology?.contractAddr as Address,
        title: loadedJsonState.anthology?.title || "Error loading title",
      })
    );

    dispatch(
      addManyMemoirsToUserLocalAnthology({
        contract: loadedJsonState.anthology?.contractAddr as Address,
        memoirs: loadedJsonState.anthology?.anthology as MemoirInterface[],
      })
    );

    dispatch(
      setDefaultSkin({
        contract: loadedJsonState.anthology?.contractAddr as Address,
        newDefaultSkin: loadedJsonState.anthology?.defaultSkin as SkinType,
      })
    );
  };

  const addDiscoveriesToMemory = () => {
    dispatch(updateUsers(loadedJsonState.discoveries?.users as Address[]));

    dispatch(
      updateUserContracts(
        loadedJsonState.discoveries?.userContracts as UserContractsType
      )
    );
    dispatch(
      updateContractTitles(
        loadedJsonState.discoveries?.contractsTitles as ContractTitlesType
      )
    );
  };

  const addMemoryToMemory = () => {
    dispatch(
      updateLocalUserContracts(
        loadedJsonState.localMemory?.userContracts as UserContractsType
      )
    );
    dispatch(
      updateLocalContractTitles(
        loadedJsonState.localMemory?.contractsTitles as ContractTitlesType
      )
    );
    dispatch(
      setManyDefaultSkin(
        loadedJsonState.localMemory?.defaultSkin as { [key: Address]: SkinType }
      )
    );
    dispatch(
      addAnthologiesToLocalMemory({
        anthologies: loadedJsonState.localMemory?.anthologies as AnthologyType,
      })
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      trigger={
        <span
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            padding: "10px 16px",
            borderRadius: "8px",
            display: "inline-block",
            fontSize: "14px",
            backgroundColor: "#f7fafc",
            color: "#2b6cb0",
          }}
          onClick={() => setShow(true)}
        >
          Load JSON
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "14px",
          color: "#1a1a1a",
          width: "100%",
        }}
      >
        {isValidJson !== undefined && (
          <>
            {isValidJson ? (
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  Found:
                </div>

                {hasDiscovery &&
                  (hasLocal ? (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="discoveries"
                        checked={loadDiscoveries}
                        onChange={() => setLoadDiscoveries(!loadDiscoveries)}
                        style={{ transform: "scale(1.2)" }}
                      />
                      <span>Discoveries</span>
                    </label>
                  ) : (
                    <span style={{ fontSize: "16px" }}>- Discoveries</span>
                  ))}

                {hasLocal && hasDiscovery && <br />}

                {hasLocal &&
                  (hasDiscovery ? (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="localMemory"
                        checked={loadLocalMemory}
                        onChange={() => setLoadLocalMemory(!loadLocalMemory)}
                        style={{ transform: "scale(1.2)" }}
                      />
                      <span>Local Memory</span>
                    </label>
                  ) : (
                    <span style={{ fontSize: "16px" }}>- Local Memory</span>
                  ))}

                {isOneAnthology && (
                  <div
                    style={{
                      color: "#4a5568",
                      fontSize: "16px",
                      marginTop: "8px",
                    }}
                  >
                    <span>{loadedJsonState.anthology?.title}</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  color: "#e53e3e",
                  fontWeight: "500",
                  marginBottom: "16px",
                  cursor: "pointer",
                }}
                onClick={() => setIsValidJson(undefined)}
              >
                ⚠️ JSON file is not valid.
              </div>
            )}
          </>
        )}

        {isValidJson === undefined && (
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#2b6cb0",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={handleJsonLoad}
            >
              Load JSON
            </button>
            <div
              style={{
                color: "#4a5568",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              Upload a .json file
            </div>
          </div>
        )}

        {isValidJson && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "24px",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                cursor: "pointer",
                marginRight: "16px",
              }}
              onClick={() => setIsValidJson(undefined)}
              title="Go back"
            >
              🔙
            </span>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#2b6cb0",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => {
                if (isOneAnthology) {
                  addOneAnthologyToLocal();
                  const newPath =
                    "contract/" + loadedJsonState.anthology?.contractAddr;
                  navigate("/");
                  dispatch(updateCurrentPath(newPath as CurrentPaths));
                  addToast({
                    title: "Anthology added to your memory",
                    content: loadedJsonState.anthology?.title as string,
                    variant: "success",
                    delay: 3000,
                  });
                  return;
                }

                let newPath = "";

                if (hasDiscovery) {
                  addDiscoveriesToMemory();
                  newPath = "discover";
                }

                if (hasLocal) {
                  addMemoryToMemory();
                  newPath = LOCAL_USER_PATH;
                }

                addToast({
                  title:
                    (hasDiscovery ? "Discover" : "") +
                    (hasDiscovery && hasLocal ? " & " : "") +
                    (hasLocal ? "External Memory" : ""),
                  content: "Added to your memory",
                  variant: "success",
                  delay: 3000,
                });

                dispatch(updateCurrentPath(newPath as CurrentPaths));
                navigate("/");
              }}
            >
              Add to my memory
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
