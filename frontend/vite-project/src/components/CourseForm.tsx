import { useFormContext } from "react-hook-form";
import { Button, Loader, MultiSelect, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { CourseInfo, FormProps } from "../sharedTypes";
import { useGetStudentsQuery } from "../api/studentApi";
import { displayNotification } from "./notifications";
import { FaPlus } from "react-icons/fa6";

function CourseForm({ mode = "creation", onSubmit, errorMessage }: FormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useFormContext<CourseInfo>();

  const [students, setStudents] = useState<{ label: string; value: string }[]>(
    []
  );

  const {
    data: studentData,
    isLoading: isStudentFetchLoading,
    isSuccess: isStudentFetchSuccess,
    isError: isStudentFetchError,
    error: studentFetchError,
  } = useGetStudentsQuery();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Course name"
        placeholder="Enter course name"
        {...register("courseName", { required: "Class name is required" })}
        error={errors?.courseName?.message}
      />
      <TextInput
        label="Course Code"
        placeholder="Enter course code"
        {...register("courseCode", { required: "Code code is required" })}
        error={errors?.courseCode?.message}
      />
      
      <TextInput
        type="number"
        label="Credit"
        placeholder="Enter course credit"
        {...register("credit", {
          required: "Code credit is required",
          max: { value: 10, message: "Cannot be more than 10" },
          min: { value: 0, message: "Cannot be less than 0" },
          valueAsNumber: true,
        })}
        error={errors?.credit?.message}
      />

      <p className="text-red-600 mt-3">{errorMessage}</p>

      <Button type="submit" color="#15803d" mt={10}>
        {mode === "edit" ? "Save Changes" : "Submit"}
      </Button>
    </form>
  );
}

export default CourseForm;
