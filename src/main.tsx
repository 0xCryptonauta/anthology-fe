import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootView } from "./views/RootView.tsx";
import { UsersView } from "./views/UsersView.tsx";
import { FactoryStateView } from "./views/FactoryStateView.tsx";
import { AboutView } from "./views/AboutView.tsx";
import { AccountView } from "./views/AccountView.tsx";
import { StrictMode } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    errorElement: <div>Error 404</div>,
    children: [
      {
        path: "/",
        element: <UsersView />,
      },
      {
        path: "account",
        element: <AccountView />,
      },
      {
        path: "info",
        element: <FactoryStateView />,
      },
      {
        path: "about",
        element: <AboutView />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
