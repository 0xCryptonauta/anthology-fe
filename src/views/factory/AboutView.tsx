import { useAppDispatch } from "@store/utils/hooks";
import { persistor, store } from "@store/redux";
import { clearAnthologyStore } from "@store/slices/anthologySlice";
import { clearFactoryStore } from "@store/slices/factorySlice";
import { useToast } from "@components/Layout/Toast";
import InstallPWAButton from "@src/components/Layout/InstallPWAButton";

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
                title: "Redux Store Size",
                content: currentStoreSize + " KB",
                variant: "success",
              });
            }}
          >
            Calculate size of storage
          </button>
        </div>

        <button
          onClick={async () => {
            dispatch(clearAnthologyStore());
            dispatch(clearFactoryStore());
            await persistor.purge();
            setTimeout(() => {
              window.location.reload();
            }, 5000);

            addToast({
              title: "Redux Store Cleaned",
              content: "The store has been cleaned, reloading in 5seconds...",
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
