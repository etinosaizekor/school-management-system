import { FindQueryResult, Student } from "../sharedTypes";
import { api } from "./baseApi";

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation({
      query: (newStudent) => ({
        url: "/students",
        method: "POST",
        body: newStudent,
      }),
      invalidatesTags: ["Student"],
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: ["Student"],
    }),
    getStudents: builder.query<FindQueryResult, void>({
      query: () => `/students`,
      providesTags: ["Student"],
    }),
    enrollCourses: builder.mutation({
      query: ({ studentId, courseIds }) => ({
        url: `/students/${studentId}/courses`,
        method: "POST",
        body: courseIds,
      }),
      invalidatesTags: ["Student"],
    }),
    unenrollCourses: builder.mutation({
      query: ({ studentId, courseId }) => ({
        url: `/students/${studentId}/courses`,
        method: "PATCH",
        body: [courseId],
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation<Student, {id: number, modifiedStudentData: any}>({
      query: ({id, modifiedStudentData}) => ({
        url: `/students/${id}`,
        method: "PUT",
        body: modifiedStudentData
      }),
      
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetStudentQuery,
  useLazyGetStudentsQuery,
  useLazyGetStudentQuery,
  useGetStudentsQuery,
  useEnrollCoursesMutation,
  useUnenrollCoursesMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
