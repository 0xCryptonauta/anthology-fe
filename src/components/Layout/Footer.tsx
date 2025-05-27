import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch } from "@src/store/utils/hooks";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div
      className="bg-dark"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        color: "#222222",
        height: "50px",
      }}
    >
      <span>Recording the collective memory</span>
      <span
        onClick={() => {
          dispatch(updateCurrentPath(`factory`));
          navigate("/");
        }}
      >
        .
      </span>
    </div>
  );
};
