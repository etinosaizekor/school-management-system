import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Classes, { fetchClasses } from "./pages/Classes";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/classes",
        element: <Classes />,
        loader: fetchClasses,
      },
    ],
  },
]);

export default router;
