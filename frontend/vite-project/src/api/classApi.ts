import { FindQueryResult } from "../sharedTypes";
import { api } from "./baseApi";

export const classApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<FindQueryResult, void>({
      query: () => "/classes",
      providesTags: ["Class"],
    }),
    getClassById: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: ["Class"],
    }),
    createClass: builder.mutation({
      query: (newClass) => ({
        url: "/classes",
        method: "POST",
        body: newClass,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useLazyGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
