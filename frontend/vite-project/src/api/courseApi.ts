import { Course, FindQueryResult } from "../sharedTypes";
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
      query: ({ id, ...updateData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: updateData,
      }),
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
  useDeleteCourseMutation,
} = courseApi;
