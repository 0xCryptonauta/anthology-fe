import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "@store/redux.ts";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootView } from "@views/RootView.tsx";
import { UsersView } from "@views/factory/UsersView.tsx";
import { UserView } from "@views/factory/UserView.tsx";
import { FactoryStateView } from "@views/factory/FactoryStateView.tsx";
import { AboutView } from "@views/factory/AboutView.tsx";
import { AccountView } from "@views/factory/AccountView.tsx";
import { StrictMode } from "react";
import { AnthologyView } from "@views/anthology/AnthologyView.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "@components/Layout/Toast.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    errorElement: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        Error 404: Page Not Found
      </div>
    ),
    children: [
      {
        index: true,
        element: <UsersView />,
      },
      {
        path: "info",
        element: <FactoryStateView />,
      },
      {
        path: "about",
        element: <AboutView />,
      },
      {
        path: "account",
        element: <AccountView />,
      },
      {
        path: "/:ethAddr/:id",
        element: <AnthologyView />,
      },
      {
        path: "/:ethAddr",
        element: <UserView />,
      },
      {
        path: "not-found",
        element: (
          <div style={{ display: "flex", justifyContent: "center" }}>
            Error 404: Page Not Found
          </div>
        ),
      },
    ],
  },

  {
    path: "*",
    element: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        Error 404: Page Not Found
      </div>
    ),
  },
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
