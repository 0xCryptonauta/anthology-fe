import { useDispatch } from "react-redux";
import { store } from "../../store";
import { clearAnthologyStore } from "../../slices/anthologySlice";
import { clearFactoryStore } from "../../slices/factorySlice";

export const AboutView = () => {
  const dispatch = useDispatch();
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "100svh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      Some description about this project
      <button
        onClick={() => {
          console.log(
            "The redux store size is: ",
            JSON.stringify(store.getState()).length / 1000,
            "KB"
          );
        }}
      >
        size of redux storage
      </button>
      <button
        onClick={() => {
          dispatch(clearAnthologyStore());
          dispatch(clearFactoryStore());
        }}
      >
        CLEAN STORE
      </button>
    </div>
  );
};
