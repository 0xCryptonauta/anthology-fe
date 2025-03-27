import { useDispatch } from "react-redux";
import { store } from "../../store";
import { clearAnthologyStore } from "../../slices/anthologySlice";
import { clearFactoryStore } from "../../slices/factorySlice";
import { useState } from "react";
import { useToast } from "../../components/Layout/Toast";
export const AboutView = () => {
  const dispatch = useDispatch();

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
      {/*       {showToast && (
        <Toast
          title="Redux Store Size"
          content={reduxSize + " KB"}
          variant="success"
          onClose={() => console.log("Toast closed")}
        />
      )} */}
    </div>
  );
};
