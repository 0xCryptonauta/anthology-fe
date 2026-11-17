import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { toggleCategoryBackgrounds } from "@store/slices/dappSlice";
import { useTranslation } from "@src/i18n/useTranslation";
import { Form } from "react-bootstrap";

export const CategoryBackgroundsToggle = ({
  showLabel = true,
}: {
  showLabel?: boolean;
}) => {
  const { t } = useTranslation();
  const enabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const dispatch = useAppDispatch();

  return (
    <Form.Check
      type="switch"
      reverse
      label={showLabel ? t("backgrounds.toggle") : undefined}
      aria-label={showLabel ? undefined : t("backgrounds.toggle")}
      checked={enabled}
      onChange={() => dispatch(toggleCategoryBackgrounds())}
      className="text-white"
    />
  );
};
