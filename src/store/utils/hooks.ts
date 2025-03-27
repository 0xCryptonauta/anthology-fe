import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@store/redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
