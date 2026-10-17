import { useAppSelector } from "@src/store/utils/hooks";

export const useTheme = () => {
  const theme = useAppSelector((state) => state.dapp.theme);
  return { theme, isLight: theme === "light" };
};
