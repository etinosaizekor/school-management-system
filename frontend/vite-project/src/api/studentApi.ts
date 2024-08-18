
import { FindQueryResult, Student } from "../sharedTypes";
import { api } from "./baseApi";

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`, 
    }),
    getStudents: builder.query<FindQueryResult, void>({
      query: () => `/students`,
    }),
    enrollCourses: builder.mutation({
      query: ({ studentId, courseIds }) => ({
        url: `/students/${studentId}/courses`,
        method: "POST",
        body: { courseIds },
      }),
    }),
    unenrollCourses: builder.mutation({
      query: ({ studentId, courseIds }) => ({
        url: `/students/${studentId}/courses`,
        method: "DELETE",
        body: { courseIds },
      }),
    }),
  }),
 
});

export const {
  useGetStudentQuery,
  useGetStudentsQuery,
  useEnrollCoursesMutation,
  useUnenrollCoursesMutation,
} = studentApi;
