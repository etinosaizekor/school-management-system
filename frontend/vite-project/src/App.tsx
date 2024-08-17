import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Classes, { fetchClasses } from "./pages/ClassList";
import ClassDetails, { fetchClassDetails } from "./pages/ClassDetails";

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
        path: "/classes/:classId",
        element: <ClassDetails />,
        loader: async ({ params }) => fetchClassDetails(params.classId!),
      },
    ],
  },
]);

export default router;
