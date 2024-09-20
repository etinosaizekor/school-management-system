import { useForm, useFormContext } from "react-hook-form";
import { Button, Loader, MultiSelect, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClassInfo, FormProps, Student, StudentInfo } from "../sharedTypes";
import {
  useCreateStudentMutation,
  useGetStudentsQuery,
} from "../api/studentApi";
import { displayNotification } from "./notifications";

export default function ClassForm({
  mode = "creation",
  onSubmit,
  errorMessage,
}: FormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useFormContext<ClassInfo>();

  const [students, setStudents] = useState<{ label: string; value: string }[]>(
    []
  );
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);

  const {
    data: studentData,
    isLoading: isStudentFetchLoading,
    isSuccess: isStudentFetchSuccess,
    isError: isStudentFetchError,
    error: studentFetchError,
  } = useGetStudentsQuery();

  const [createStudent, { isLoading }] = useCreateStudentMutation();

  useEffect(() => {
    if (isStudentFetchSuccess && studentData) {
      setStudents(
        studentData.items.map(({ id, firstName, lastName }) => ({
          value: id.toString(),
          label: `${firstName} ${lastName}`,
        }))
      );
    }
    if (isStudentFetchError) {
      let errorMessage;
      if ("data" in studentFetchError) {
        const errorData: any = studentFetchError.data;
        errorMessage =
          errorData.message ||
          "Error occured while fetching students. Try again";
      }
      displayNotification({
        title: "Failed to fetch students",
        message: errorMessage,
        type: "error",
      });
    }
  }, [isStudentFetchSuccess, isStudentFetchError, studentData]);

  const formMethods = useForm<Student>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      Class: {},
      Courses: [],
    },
  });
  const { reset } = formMethods;

  const handleNewStudentCreation = (data: StudentInfo) => {
    const { courseIds, classId } = data;
    const studentFormData = {
      ...data,
      courseIds: courseIds
        ? courseIds.map((courseId) => parseInt(courseId))
        : [],
      classId: parseInt(classId),
    };
    createStudent(studentFormData)
      .unwrap()
      .then(({ id, firstName, lastName }) => {
        setStudents([
          ...students,
          {
            label: `${firstName} ${lastName}`,
            value: id.toString(),
          },
        ]);
        const studentIds = watch("studentIds");
        console.log("Current student Ids", studentIds);

        setValue("studentIds", [...studentIds, id.toString()]);
        setIsStudentFormOpen(false);

        displayNotification({
          title: "Success",
          message: "Student created successfully!",
          type: "success",
        });
        reset();
      })
      .catch((error) => {
        console.log(error);
        displayNotification({
          title: "Error",
          message: error?.data?.message || "An error occurred",
          type: "error",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Class name"
        placeholder="Enter class name"
        {...register("className", { required: "Class name is required" })}
        error={errors?.className?.message}
      />

      <p className="text-red-600 mt-3">{errorMessage}</p>

      <Button type="submit" color="#15803d" mt={10}>
        {mode === "edit" ? "Save Changes" : "Submit"}
      </Button>
    </form>
  );
}
