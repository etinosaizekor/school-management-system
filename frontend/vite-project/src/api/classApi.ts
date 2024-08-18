import { FindQueryResult } from "../sharedTypes";
import { api } from "./baseApi";

export const classApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<FindQueryResult, void>({
      query: () => "/classes",
    }),
    getClassById: builder.query({
      query: (id) => `/classes/${id}`,
    }),
    createClass: builder.mutation({
      query: (newClass) => ({
        url: "/classes",
        method: "POST",
        body: newClass,
      }),
    }),
    updateClass: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
