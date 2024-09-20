import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Button, Loader, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useCreateClassMutation, useGetClassesQuery } from "../api/classApi";
import { useGetCoursesQuery } from "../api/courseApi";
import { Class, ClassInfo, FormProps, StudentInfo } from "../sharedTypes";
import { formatDate } from "../utils/dateUtils";
import { IoAdd } from "react-icons/io5";
import CustomModal from "./CustomModal";
import ClassForm from "./ClassForm";
import { useCreateStudentMutation } from "../api/studentApi";
import { displayNotification } from "./notifications";

interface StudentFormProps extends FormProps {
  isSubmitting: boolean;
  isOpen: boolean;
  close: () => void;
}

function StudentForm({
  mode = "creation",
  onSubmit,
  isSubmitting,
  isOpen,
  close,
}: StudentFormProps) {
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
  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [classCreationError, setClassCreationError] = useState("");
  const formMethods = useForm<ClassInfo>({
    defaultValues: {
      className: "",
      studentIds: [],
    },
  });
  const { reset } = formMethods;
  const [createClass] = useCreateClassMutation();
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

  const onClassSubmit = async (data: ClassInfo) => {
    const { studentIds } = data;

    const classFormData = {
      ...data,
      studentIds: studentIds ? studentIds.map((id) => parseInt(id)) : [],
    };

    createClass(classFormData)
      .unwrap()
      .then((newClass: Class) => {
        setClasses((prevClasses) => [
          ...prevClasses,
          { label: newClass.className, value: newClass.id.toString() },
        ]);
        setValue('classId', newClass.id.toString())
        displayNotification({
          title: "Success",
          message: "Class created successfully!",
          type: "success",
        });
        setClassCreationError("");
        reset();
        setIsClassFormOpen(false);
      })
      .catch((error) => {
        const err = error?.data?.message;
        setClassCreationError(err);
      });
  };

  return (
    <CustomModal
      opened={isOpen}
      onClose={close}
      title={isClassFormOpen ? "Create new class" : "Create new student"}
      buttonText=""
      open={() => void 0}
      size="lg"
      withBackButton={isClassFormOpen && true}
      onBackButtonClick={() => setIsClassFormOpen(false)}
    >
      {isClassFormOpen ? (
        <FormProvider {...formMethods}>
          <ClassForm onSubmit={onClassSubmit} />
        </FormProvider>
      ) : (
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
            value={formatDate(watch("dateOfBirth"))}
            {...register("dateOfBirth", {
              required: "Date of birth is required",
              max: {
                value: new Date().toString(),
                message: "Invalid date input",
              },
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
          <div className="flex justify-end mt-2">
            <Button
              variant="subtle"
              color="#15803d"
              p={5}
              onClick={() => setIsClassFormOpen(true)}
              rightSection={<IoAdd color="#15803d" size={20} />}
            >
              Create Class
            </Button>
          </div>

          <Button type="submit" color="#15803d" mt={10} loading={isSubmitting}>
            {mode === "edit" ? "Save Changes" : "Submit"}
          </Button>
        </form>
      )}
    </CustomModal>
  );
}

export default StudentForm;
