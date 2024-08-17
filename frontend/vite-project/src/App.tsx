import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Classes, { fetchClasses } from "./pages/ClassList";
import ClassDetails from "./pages/ClassDetails";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/classes",
        element: <Classes />,
        loader: fetchClasses,
      },
      {
        path: "/classDetails",
        element: <ClassDetails />,
      },
    ],
  },
]);

export default router;
