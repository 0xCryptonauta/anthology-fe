import { useState } from "react";
//import { ChangeAnthologyTitle } from "./ChangeAnthologyTitle";
import { useToast } from "@components/Layout/Toast";

import {
  //useAppSelector,
  useAppDispatch,
  useAppSelector,
} from "@store/utils/hooks";
import { Address } from "@src/types/common";
import { updateUserLocalAnthologyTitle } from "@src/store/slices/localAnthologySlice";
import { MAX_TITLE_LENGTH } from "@src/utils/constants";

import { ChangeAnthologyDefaultSkin } from "./ChangeAnthologyDefaultSkin";

export const LocalAnthologyOwner = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const { addToast } = useToast();

  const { contractsTitles } = useAppSelector((state) => state.localAnthology);

  const currentTitle = contractsTitles[contractAddr] || "";

  const dispatch = useAppDispatch();

  const [newTitle, setNewTitle] = useState(currentTitle);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        //border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "20px 5px",
      }}
    >
      {/* <h2>Anthology basic settings</h2> */}
      <br />
      {/* ------------------------------- Update Anthology title ------------------------------ */}
      <div
        style={{
          //border: "1px solid white",
          padding: "5px",
          borderRadius: "7px",
          margin: "3px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ marginBottom: "10px" }}>Set new Title</span>
          <textarea
            value={newTitle}
            placeholder={"[Cat][Subcat]Title"}
            style={{
              height: "80px",
              minHeight: "80px",
              maxHeight: "150px",
              //backgroundColor: "white",
              color: "white",
              borderRadius: "5px",
              width: "320px",
              textAlign: "center",
              alignContent: "center",
            }}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(e) => setNewTitle(e.target.value)}
          ></textarea>
          <button
            style={{ marginTop: "10px", backgroundColor: "dodgerblue" }}
            onClick={async () => {
              try {
                addToast({
                  title: "New title:",
                  content: newTitle,
                  variant: "success",
                  delay: 5000,
                });
                console.log("new title:", newTitle);
                dispatch(
                  updateUserLocalAnthologyTitle({
                    contract: contractAddr,
                    newTitle: newTitle,
                  })
                );
              } catch (error) {
                addToast({
                  title: "Error setting new title",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting new title", error);
              }
            }}
          >
            Change title
          </button>
        </div>
      </div>
      <br />
      <ChangeAnthologyDefaultSkin contractAddr={contractAddr} />

      {/* ----------------------------------- cleanMemoirs ------------------------------------ */}

      {/* <div style={{ marginTop: "20px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            try {
              
              if (txHash) {
                addToast({
                  title: "Cleaning memoirs",
                  content: "txHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error cleaning memoirs",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error cleaning memoirs", error);
            }
          }}
        >
          Clean Memoirs
        </button>
      </div> */}
    </div>
  );
};
