import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Classes from "./pages/ClassList";
import ClassDetails from "./pages/ClassDetails";
import CourseList from "./pages/CourseList";
import CourseDetails from "./pages/CourseDetails";
import StudentList from "./pages/StudentList";
import StudentDetails from "./pages/StudentDetails";
import {
  fetchClasses,
  fetchClassById,
  fetchCourses,
  fetchCourseById,
  fetchStudents,
  fetchStudentById,
} from "./loaders";

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
        loader: async ({ params }) => fetchClassById(params.classId!),
      },
      {
        path: "/courses",
        element: <CourseList />,
        loader: fetchCourses,
      },
      {
        path: "/courses/:courseId",
        element: <CourseDetails />,
        loader: async ({ params }) => fetchCourseById(params.courseId!),
      },
      {
        path: "/students",
        element: <StudentList />,
        loader: fetchStudents,
      },
      {
        path: "/students/:studentId",
        element: <StudentDetails />,
        loader: async ({ params }) => fetchStudentById(params.studentId!),
      },
      {
        path: "/",
        element: <Navigate to="/classes" replace />,
      },
    ],
  },
]);

export default router;
