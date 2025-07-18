import { store } from "@store/redux";
import { useToast } from "@components/Layout/Toast";

export const AboutView = () => {
  const { addToast } = useToast();

  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
        flexWrap: "wrap",
        gap: "1.5rem",
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
        <button
          onClick={() => {
            const currentStoreSize =
              JSON.stringify(store.getState()).length / 1000;
            addToast({
              title: "Your memory size:",
              content: currentStoreSize.toFixed(2) + " KB",
              variant: "success",
            });
          }}
        >
          Memory being used
        </button>
      </div>
    </div>
  );
};
