import store from "./api";
import { classApi } from "./api/classApi";
import { courseApi } from "./api/courseApi";
import { studentApi } from "./api/studentApi";

export const fetchClasses = async () => {
  const result = await store.dispatch(
    classApi.endpoints.getClasses.initiate()
  );
  return result.data;
};

export const fetchCourses = async () => {
  const result = await store.dispatch(
    courseApi.endpoints.getCourses.initiate()
  );
  return result.data;
};

export const fetchStudents = async () => {
  const result = await store.dispatch(
    studentApi.endpoints.getStudents.initiate()
  );
  return result.data;
};

export const fetchClassById = async (id: string) => {
  const result = await store.dispatch(
    classApi.endpoints.getClassById.initiate(id)
  );
  return result.data;
};

export const fetchCourseById = async (id: string) => {
  const result = await store.dispatch(
    courseApi.endpoints.getCourseById.initiate(id)
  );
  return result.data;
};

export const fetchStudentById = async (id: string) => {
  const result = await store.dispatch(
    studentApi.endpoints.getStudent.initiate(id)
  );
  return result.data;
};
