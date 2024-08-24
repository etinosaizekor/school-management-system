import { FindQueryResult } from "../sharedTypes";
import { api } from "./baseApi";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<FindQueryResult, void>({
      query: () => "/courses",
      providesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ["Course"],
    }),
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/courses",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, modifiedClassData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: modifiedClassData,
      }),
      invalidatesTags: ["Course"],
    }),
    enrollStudents: builder.mutation({
      query: ({ courseId, studentId }) => ({
        url: `/courses/${courseId}/students`,
        method: "POST",
        body: studentId,
      }),
      invalidatesTags: ["Course"],
    }),
    unenrollStudentFromCourse: builder.mutation({
      query: ({ courseId, studentId }) => {
        return {
          url: `/courses/${courseId}/students`,
          method: "DELETE",
          body: [studentId],
        };
      },
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useLazyGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useEnrollStudentsMutation,
  useUnenrollStudentFromCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
