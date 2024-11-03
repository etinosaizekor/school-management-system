import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { redirect } from "react-router-dom";
import { displayNotification } from "../components/notifications";

const baseQueryWithAuth = async (
  args: any,
  api: BaseQueryApi,
  extraOptions = {}
) => {
  // Use fetchBaseQuery to make the actual request
  const result = await fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    credentials: "include",
  })(args, api, extraOptions);

  // Check for 401 Unauthorized status
  if (result.error && result.error.status === 401) {
    displayNotification({
      message: "Your session has expired",
      title: "Session expired",
      type: "error",
    });
    redirect("/login");
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
  tagTypes: ["Student", "Course", "Class"],
});
