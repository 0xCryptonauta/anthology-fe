import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { toggleCategoryBackgrounds } from "@src/store/slices/dappSlice";
import { Form } from "react-bootstrap";

export const CategoryBackgroundsToggle = () => {
  const enabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const dispatch = useAppDispatch();

  return (
    <Form.Check
      type="switch"
      label="Category Backgrounds"
      checked={enabled}
      onChange={() => dispatch(toggleCategoryBackgrounds())}
      className="text-white"
    />
  );
};
