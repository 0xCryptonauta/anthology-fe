import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { toggleCategoryBackgrounds } from "@src/store/slices/dappSlice";
import { Form } from "react-bootstrap";
import { useTheme } from "@src/hooks/useTheme";

export const CategoryBackgroundsToggle = () => {
  const enabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const { isLight } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <Form.Check
      type="switch"
      reverse
      label="Category Backgrounds"
      checked={enabled}
      onChange={() => dispatch(toggleCategoryBackgrounds())}
      className={isLight ? "text-dark" : "text-white"}
    />
  );
};
