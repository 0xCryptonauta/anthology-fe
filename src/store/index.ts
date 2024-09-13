import { configureStore } from "@reduxjs/toolkit";
import factoryReducer from "../slices/factorySlice";
import userReducer from "../slices/userSlice";
import anthologyReducer from "../slices/anthologySlice";

export const store = configureStore({
  reducer: {
    factory: factoryReducer,
    user: userReducer,
    anthology: anthologyReducer,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
