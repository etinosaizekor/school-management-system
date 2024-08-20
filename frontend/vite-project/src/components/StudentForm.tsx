import { useForm, useFormContext } from "react-hook-form";
import { Button, Loader, MultiSelect, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetClassesQuery, useLazyGetClassesQuery } from "../api/classApi";
import { useGetCoursesQuery } from "../api/courseApi";
import { StudentInfo } from "../sharedTypes";

interface StudentFormProps {
  mode?: "creation" | "edit";
  onSubmit: (data: StudentInfo) => void;
  initialData?: StudentInfo;
}

function StudentForm({
  mode = "creation",
  onSubmit,
  initialData,
}: //   isFormSubmissionSuccess
StudentFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useFormContext<StudentInfo>();

  const [classes, setClasses] = useState<{ label: string; value: string }[]>(
    []
  );
  const [courses, setCourses] = useState<{ label: string; value: string }[]>(
    []
  );

  const {
    data: classData,
    isLoading: isGetClassesLoading,
    isSuccess: isGetClassesSuccess,
    isError: isGetClassesError,
  } = useGetClassesQuery();

  const {
    data: coursesData,
    isLoading: isGetCoursesLoading,
    isSuccess: isGetCoursesSuccess,
    isError: isGetCoursesError,
  } = useGetCoursesQuery();

  useEffect(() => {
    if (isGetCoursesSuccess && coursesData) {
      setCourses(
        coursesData.items.map((course) => ({
          value: course.id.toString(),
          label: course.courseName,
        }))
      );
    }
  }, [isGetClassesSuccess, isGetClassesError, coursesData]);

  useEffect(() => {
    if (isGetClassesSuccess && classData) {
      setClasses(
        classData.items.map((cls) => ({
          value: cls.id.toString(),
          label: cls.className,
        }))
      );
    }
  }, [isGetClassesSuccess, isGetClassesError, classData]);

  //   const {
  //     register,
  //     watch,
  //     handleSubmit,
  //     formState: { errors },
  //     reset,
  //     setValue,
  //     clearErrors,
  //   } = useForm<StudentInfo>({
  //     defaultValues: initialData || {}, // Populate with initialData if provided
  //   });

  // Populate fields on initialData change (for edit mode)
  //   useEffect(() => {
  //     if (mode === "edit" && initialData) {
  //       reset(initialData);
  //     }
  //   }, [mode, initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="First Name"
        placeholder="Enter first name"
        {...register("firstName", { required: "First name is required" })}
        error={errors?.firstName?.message}
      />

      <TextInput
        label="Last Name"
        placeholder="Enter last name"
        {...register("lastName", { required: "Last name is required" })}
        error={errors.lastName?.message}
      />

      <TextInput
        label="Date of Birth"
        type="date"
        {...register("dateOfBirth", {
          required: "Date of birth is required",
        })}
        error={errors.dateOfBirth?.message}
      />

      <Select
        value={watch("classId")}
        label="Class"
        placeholder="Select class"
        data={classes}
        {...register("classId", { required: "Class is required" })}
        error={errors.classId?.message}
        onChange={(value) => {
          if (value) {
            clearErrors("classId");
            setValue("classId", value);
          }
        }}
        nothingFoundMessage="No classes available"
        rightSection={isGetClassesLoading && <Loader />}
      />

      <MultiSelect
        value={watch("courseIds")}
        label="Courses"
        placeholder="Select courses"
        data={courses}
        error={errors.courseIds?.message}
        multiple
        onChange={(selectedValues: string[]) => {
          clearErrors("courseIds");
          setValue("courseIds", selectedValues);
        }}
        nothingFoundMessage="No courses available"
        rightSection={isGetCoursesLoading && <Loader />}
      />

      <Button type="submit" color="#15803d" mt={10}>
        {mode === "edit" ? "Save Changes" : "Submit"}
      </Button>
    </form>
  );
}

export default StudentForm;
