import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "@store/redux.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "@components/Layout/Toast.tsx";
import { NotFound } from "@views/NotFound.tsx";
import { RootView } from "@views/RootView.tsx";
import { FactoryStateView } from "@views/factory/FactoryStateView.tsx";
import { AboutView } from "@views/factory/AboutView.tsx";
import { IndexView } from "@views/IndexView.tsx";
import { AnthologyShareView } from "@views/anthology/AnthologyShareView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <IndexView /> },
      { path: "info", element: <FactoryStateView /> },
      { path: "about", element: <AboutView /> },
      { path: "/share", element: <AnthologyShareView /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  import.meta.env.VITE_ENV === "development" ? (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </PersistGate>
    </Provider>
  ) : (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  )
);
