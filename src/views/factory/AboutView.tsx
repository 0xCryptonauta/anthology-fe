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

export const AboutView = () => {
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

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

      <InstallPWAButton />
      <NetworkSettings />
      <IconPathSwitcher />
    </div>
  );
};
