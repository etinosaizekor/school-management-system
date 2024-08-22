import { useFormContext } from "react-hook-form";
import { Button, Loader, MultiSelect, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClassInfo, FormProps } from "../sharedTypes";
import { useGetStudentsQuery } from "../api/studentApi";
import { displayNotification } from "./notifications";

function ClassForm({ mode = "creation", onSubmit }: FormProps) {
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
        label="Class name"
        placeholder="Enter class name"
        {...register("className", { required: "Class name is required" })}
        error={errors?.className?.message}
      />

      <MultiSelect
        value={watch("studentIds")}
        label="Students"
        placeholder="Select students"
        data={students}
        error={errors.studentIds?.message}
        multiple
        onChange={(selectedValues: string[]) => {
          clearErrors("studentIds");
          setValue("studentIds", selectedValues);
        }}
        nothingFoundMessage="No courses available"
        rightSection={isStudentFetchLoading && <Loader />}
      />

      <Button type="submit" color="#15803d" mt={10}>
        {mode === "edit" ? "Save Changes" : "Submit"}
      </Button>
    </form>
  );
}

export default ClassForm;
