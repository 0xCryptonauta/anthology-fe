import { configureStore, combineReducers } from "@reduxjs/toolkit";
import factoryReducer from "./slices/factorySlice";
import userReducer from "./slices/userSlice";
import anthologyReducer from "./slices/anthologySlice";
import dappReducer from "./slices/dappSlice";
import storage from "redux-persist/lib/storage";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  //version: 1,
  storage, // sessionStorage
  //whitelist: ["anthology", "factory", "user"], // slices gestionados por redux-persist
};

const rootReducer = combineReducers({
  factory: factoryReducer,
  user: userReducer,
  anthology: anthologyReducer,
  dapp: dappReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  //devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
