import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ReactElement } from "react";
import store from "../api";
import { Notifications } from "@mantine/notifications";

// Create a custom render function with all providers
function customRender(
  ui: ReactElement,
  {
    route = "/", // Default route for the test
    router = createMemoryRouter([{ path: route, element: ui }]), // Mock router
    ...renderOptions
  } = {}
) {
  return render(
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>,
    renderOptions
  );
}

// Export the custom render function
export { customRender as render };
