import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { Header } from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Header />
    <App />
  </Provider>
);
