import {
  Button,
  Grid,
  Paper,
  Modal,
  TextInput,
  Select,
  Group,
  Loader,
  MultiSelect,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Class, Course, FindQueryResult, Student } from "../sharedTypes";
import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { useLazyGetCoursesQuery } from "../api/courseApi";
import { useLazyGetClassesQuery } from "../api/classApi";
import {
  useCreateStudentMutation,
  useGetStudentsQuery,
} from "../api/studentApi";
import { fetchStudents } from "../loaders";

interface StudentListCardProps {
  id: number;
  firstName: string;
  classId: string;
  numberOfCoursesEnrolled: number;
}

export interface StudentInfo extends Omit<Student, "Courses"> {
  courseIds: string[];
  dateOfBirth: Date;
}

function StudentListCard({
  id,
  firstName,
  numberOfCoursesEnrolled,
}: StudentListCardProps) {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <Link to={`/students/${id}`}>
        <div className="flex flex-col justify-center h-full gap-1">
          <h5 className="secondary-color">{firstName}</h5>
          <h6> {numberOfCoursesEnrolled} Courses</h6>
        </div>
      </Link>
    </Paper>
  );
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const { data, isLoading, isSuccess } = useGetStudentsQuery();

  useEffect(() => {
    if (isSuccess && data) {
      setStudents(data.items);
    }
  }, [isSuccess, data]);

  const [opened, { open, close }] = useDisclosure(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<StudentInfo>();
  const [classes, setClasses] = useState<{ label: string; value: string }[]>(
    []
  );
  const [courses, setCourses] = useState<{ label: string; value: string }[]>(
    []
  );
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [createStudent] = useCreateStudentMutation();

  const [
    getCourses,
    {
      isLoading: isGetCoursesLoading,
      isSuccess: isGetCoursesSuccess,
      isError: isGetCoursesError,
    },
  ] = useLazyGetCoursesQuery();
  const [
    getClasses,
    {
      isLoading: isGetClassesLoading,
      isSuccess: isGetClassesSuccess,
      isError: isGetClassesError,
    },
  ] = useLazyGetClassesQuery();

  const handleDialogOpen = () => {
    open();
    if (classes.length === 0) {
      getClasses()
        .unwrap()
        .then((data) =>
          setClasses(
            data.items.map((cls) => ({
              value: cls.id.toString(),
              label: cls.className,
            }))
          )
        );
    }
    if (courses.length === 0) {
      getCourses()
        .unwrap()
        .then((data) =>
          setCourses(
            data.items.map((course) => ({
              value: course.id.toString(),
              label: course.courseName,
            }))
          )
        );
    }
  };

  const onSubmit = async (data: StudentInfo) => {
    console.log(data);
    const { courseIds, classId } = data;
    const studentFormData = {
      ...data,
      courseIds: courseIds.map((courseId) => parseInt(courseId)),
      classId: parseInt(classId),
    };

    createStudent(studentFormData)
      .unwrap()
      .then((newStudent) => {
        setStudents([...students, newStudent]);
        notifications.show({
          title: "Success",
          message: "Student created successfully!",
          icon: <FaCheck />,
          color: "teal",
          position: "top-right",
        });
        reset();
      })
      .catch((error) =>
        notifications.show({
          title: "Error",
          message: error?.data?.message || "An error occurred",
          icon: <FaTimes />,
          color: "red",
          position: "top-right",
        })
      )
      .finally(() => close());
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex justify-end">
        <Button m={30} color="#15803d" onClick={handleDialogOpen}>
          Create New Student
        </Button>
      </div>
      <Grid>
        {students?.map(({ id, firstName, Courses }, index) => (
          <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2.4 }}>
            <StudentListCard
              id={id}
              firstName={firstName}
              numberOfCoursesEnrolled={Courses?.length || 0}
              classId="12"
            />
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={opened}
        onClose={close}
        title="Create New Student"
        size="lg"
      >
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
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
