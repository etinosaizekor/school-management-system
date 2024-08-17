import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Classes, { fetchClasses } from "./pages/ClassList";
import ClassDetails, { fetchClassDetails } from "./pages/ClassDetails";
import CourseList, { fetchCourses } from "./pages/CourseList";
import CourseDetails, { fetchCourseDetails } from "./pages/CourseDetails";
import StudentList, { fetchStudents } from "./pages/StudentList";
import StudentDetails, { fetchStudentDetails } from "./pages/StudentDetails";

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
      {
        path: "/courses",
        element: <CourseList />,
        loader: fetchCourses,
      },
      {
        path: "/courses/:courseId",
        element: <CourseDetails />,
        loader: async ({ params }) => fetchCourseDetails(params.courseId!),
      },
      {
        path: "/students",
        element: <StudentList />,
        loader: fetchStudents,
      },

      {
        path: "/students/:studentId",
        element: <StudentDetails />,
        loader: async ({ params }) => fetchStudentDetails(params.studentId!),
      },
    ],
  },
]);

export default router;
