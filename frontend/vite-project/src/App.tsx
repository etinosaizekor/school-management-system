import { createBrowserRouter, Navigate } from "react-router-dom";
import Classes from "./pages/ClassList";
import ClassDetails from "./pages/ClassDetails";
import CourseList from "./pages/CourseList";
import CourseDetails from "./pages/CourseDetails";
import StudentList from "./pages/StudentList";
import StudentDetails from "./pages/StudentDetails";
import Login from "./components/LoginForm";
import Signup from "./components/SignupForm";
import RequireAuth from "./components/RequireAuth";
import NoAuthAccess from "./components/NoAuthAccess";

const router = createBrowserRouter([
  {
    element: <NoAuthAccess />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/classes",
        element: <Classes />,
      },
      {
        path: "/classes/:classId",
        element: <ClassDetails />,
      },
      {
        path: "/courses",
        element: <CourseList />,
      },
      {
        path: "/courses/:courseId",
        element: <CourseDetails />,
      },
      {
        path: "/students",
        element: <StudentList />,
      },
      {
        path: "/students/:studentId",
        element: <StudentDetails />,
      },
      {
        path: "/",
        element: <Navigate to="/classes" replace />,
      },
    ],
  },
]);

export default router;
