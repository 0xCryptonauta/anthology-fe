import { useAppDispatch } from "@src/store/utils/hooks";
import { toggleTheme } from "@src/store/slices/dappSlice";
import { Form } from "react-bootstrap";
import { useTheme } from "@src/hooks/useTheme";

export const ThemeToggle = () => {
  const { isLight } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <Form.Check
      type="switch"
      reverse
      label="Light mode"
      checked={isLight}
      onChange={() => dispatch(toggleTheme())}
      className={isLight ? "text-dark" : "text-white"}
    />
  );
};
