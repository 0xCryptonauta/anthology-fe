import { useAppDispatch } from "@store/utils/hooks";
import { store } from "@store/redux";
import { clearAnthologyStore } from "@store/slices/anthologySlice";
import { clearFactoryStore } from "@store/slices/factorySlice";
import { useState } from "react";
import { useToast } from "@components/Layout/Toast";
import InstallPWAButton from "@src/components/Layout/InstallPWAButton";
import { WalletOptions } from "@src/components/Layout/WalletOptions";

export const AboutView = () => {
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

  const [reduxSize, setReduxSize] = useState(0);

  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <span>Some description about this project</span>

      <WalletOptions />

      <div
        style={{
          height: "250px",
          display: "flex",
          flexDirection: "column",

          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              console.log(
                "The redux store size is: ",
                JSON.stringify(store.getState()).length / 1000,
                "KB"
              );
              setReduxSize(JSON.stringify(store.getState()).length / 1000);
              //setShowToast(true);
              addToast({
                title: "Redux Store Size",
                content: reduxSize + " KB",
                variant: "success",
              });
            }}
          >
            Calculate size of storage
          </button>
          <span>{reduxSize} KB</span>
        </div>

        <button
          onClick={() => {
            dispatch(clearAnthologyStore());
            dispatch(clearFactoryStore());
            setReduxSize(JSON.stringify(store.getState()).length / 1000);
            addToast({
              title: "Redux Store Cleaned",
              content: "The store has been cleaned",
              variant: "warning",
            });
          }}
        >
          CLEAN STORE
        </button>
      </div>

      <InstallPWAButton />
    </div>
  );
};
