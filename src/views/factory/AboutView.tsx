import { useAppDispatch } from "@store/utils/hooks";
import { persistor, store } from "@store/redux";
import { resetAnthologyStore } from "@store/slices/anthologySlice";
import { resetFactoryStore } from "@store/slices/factorySlice";
import { useToast } from "@components/Layout/Toast";
import InstallPWAButton from "@src/components/Layout/InstallPWAButton";
import { NetworkSettings } from "@src/components/Layout/NetworkSettings";
import { IconPathSwitcher } from "@src/components/Layout/IconPathSwitcher";
import { resetDappStore } from "@src/store/slices/dappSlice";
import { resetUserStore } from "@src/store/slices/userSlice";
import { resetLocalAnthologyStore } from "@src/store/slices/localAnthologySlice";
import { DownloadReduxStore } from "@src/components/Layout/DownloadReduxStore";

export const AboutView = () => {
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        //height: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <span>Some description about this project</span>

      <div
        style={{
          //height: "250px",
          margin: "20px 0px",
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
              const currentStoreSize =
                JSON.stringify(store.getState()).length / 1000;
              addToast({
                title: "Your memory size:",
                content: currentStoreSize + " KB",
                variant: "success",
              });
            }}
          >
            Memory being used
          </button>
        </div>

        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
          onClick={async () => {
            dispatch(resetAnthologyStore());
            dispatch(resetFactoryStore());
            dispatch(resetDappStore());
            dispatch(resetUserStore());
            dispatch(resetLocalAnthologyStore());

            await persistor.purge();
            setTimeout(() => {
              window.location.reload();
            }, 3000);

            addToast({
              title: "Redux Store Cleaned",
              content: "The store has been cleaned, reloading in 3 seconds...",
              variant: "info",
            });
          }}
        >
          CLEAN STORE
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <InstallPWAButton />
        <NetworkSettings />
        <IconPathSwitcher />
      </div>

      <div>
        <DownloadReduxStore />
      </div>
    </div>
  );
};
