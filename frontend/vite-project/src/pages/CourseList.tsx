import { Button, Grid, Modal, Paper } from "@mantine/core";
import { Link, useLoaderData } from "react-router-dom";
import { Course, CourseInfo, FindQueryResult } from "../sharedTypes";
import { useCreateCourseMutation, useGetCoursesQuery } from "../api/courseApi";
import { useEffect, useState } from "react";
import { displayNotification } from "../components/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FormProvider, useForm } from "react-hook-form";
import CourseForm from "../components/CourseForm";
import { GoBook, GoPerson } from "react-icons/go";
import { FaBook } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";

interface CourseListCardProps {
  id: string;
  courseName: string;
  courseCode: string;
  numberOfStudents: number;
}

function CourseListCard({
  id,
  courseName,
  courseCode,
  numberOfStudents,
}: CourseListCardProps) {
  return (
    <Paper w={300} h={140} p={13} className="border border-gray-400">
      <Link to={`/courses/${id}`}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="secondary-color">{courseCode}</p>
            <HiOutlineBookOpen fontSize={25} fontVariant="outlined" />
          </div>
          <h5 className="secondary-color">{courseName}</h5>
          <div className="flex items-center gap-2 mt-2 mr-10">
            <GoPerson />
            <h6 className="text-sm">{numberOfStudents} students</h6>
          </div>
        </div>
      </Link>
    </Paper>
  );
}

export default function CourseList() {
  const { data, isLoading, isSuccess, isError, error } = useGetCoursesQuery();
  const [courses, setCourses] = useState<Course[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const formMethods = useForm<CourseInfo>();
  const { reset } = formMethods;
  const [createCourse] = useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setCourses(data.items);
    }
    if (isError) {
      let errorMessage;
      if ("data" in error) {
        const errorData: any = error.data;
        errorMessage =
          errorData.message ||
          "Error occured while fetching classes. Try again";
      }
      displayNotification({
        title: "Failed to fetch courses",
        message: errorMessage,
        type: "error",
      });
    }
  }, [isSuccess, data, isError, error]);

  const onSubmit = async (data: CourseInfo) => {
    console.log(data);
    const { studentIds } = data;
    const studentFormData = {
      ...data,
      studentIds: studentIds.map((studentId) => parseInt(studentId)),
    };

    createCourse(studentFormData)
      .unwrap()
      .then((newCourse) => {
        setCourses([...courses, newCourse]);

        displayNotification({
          title: "Success",
          message: "Student created successfully!",
          type: "success",
        });
        reset();
      })
      .catch((error) =>
        displayNotification({
          title: "Error",
          message: error?.data?.message || "An error occurred",
          type: "error",
        })
      )
      .finally(() => close());
  };

  return (
    <>
      <div className="flex justify-between align-middle m-6 ml-0">
        <h3>Courses</h3>
        <Button color="#15803d" onClick={open}>
          Create New Course
        </Button>
      </div>
      <Grid>
        {courses?.map(({ id, courseName, courseCode, Students }, index) => (
          <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2.4 }}>
            <CourseListCard
              id={id.toString()}
              courseName={courseName}
              courseCode={courseCode}
              numberOfStudents={Students?.length}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Modal
        opened={opened}
        onClose={close}
        title="Create New Course"
        size="lg"
      >
        <FormProvider {...formMethods}>
          <CourseForm onSubmit={onSubmit} />
        </FormProvider>
      </Modal>
    </>
  );
}
