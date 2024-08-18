import { Course, FindQueryResult } from "../sharedTypes";
import { api } from "./baseApi";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<FindQueryResult, void>({
      query: () => '/courses',
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
    }),
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: '/courses',
        method: 'POST',
        body: newCourse,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: updateData,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useLazyGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
