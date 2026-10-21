import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "@store/redux.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode, lazy, Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "@components/Layout/Toast.tsx";
import { NotFound } from "@views/NotFound.tsx";
import { RootView } from "@views/RootView.tsx";
import { IndexView } from "@views/IndexView.tsx";
import { ContextWagmiProvider } from "./components/Layout/ContextWagmiProvider";

const FactoryStateView = lazy(() =>
  import("@views/factory/FactoryStateView.tsx").then((m) => ({
    default: m.FactoryStateView,
  }))
);
const AboutView = lazy(() =>
  import("@views/factory/AboutView.tsx").then((m) => ({
    default: m.AboutView,
  }))
);
const PrivacyView = lazy(() =>
  import("@views/factory/PrivacyView.tsx").then((m) => ({
    default: m.PrivacyView,
  }))
);
const AnthologyShareView = lazy(() =>
  import("@views/anthology/AnthologyShareView").then((m) => ({
    default: m.AnthologyShareView,
  }))
);
const SettingsView = lazy(() =>
  import("./views/SettingsView").then((m) => ({
    default: m.SettingsView,
  }))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <IndexView /> },
      {
        path: "info",
        element: (
          <Suspense fallback={null}>
            <FactoryStateView />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={null}>
            <AboutView />
          </Suspense>
        ),
      },
      {
        path: "privacy",
        element: (
          <Suspense fallback={null}>
            <PrivacyView />
          </Suspense>
        ),
      },
      {
        path: "share",
        element: (
          <Suspense fallback={null}>
            <AnthologyShareView />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={null}>
            <SettingsView />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  import.meta.env.VITE_ENV === "development" ? (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            <ContextWagmiProvider>
              <RouterProvider router={router} />
            </ContextWagmiProvider>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  ) : (
    <StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastProvider>
              <ContextWagmiProvider>
                <RouterProvider router={router} />
              </ContextWagmiProvider>
            </ToastProvider>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </StrictMode>
  )
);
