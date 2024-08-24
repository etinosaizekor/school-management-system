import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import router from "./App.tsx";
import { Notifications } from "@mantine/notifications";
import store from "./api";
import "@mantine/notifications/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
