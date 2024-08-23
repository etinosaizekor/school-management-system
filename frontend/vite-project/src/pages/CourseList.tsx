import { Button, Grid, Modal, Paper } from "@mantine/core";
import { Link, useLoaderData } from "react-router-dom";
import { Course, CourseInfo, FindQueryResult } from "../sharedTypes";
import { useCreateCourseMutation, useGetCoursesQuery } from "../api/courseApi";
import { useEffect, useState } from "react";
import { displayNotification } from "../components/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FormProvider, useForm } from "react-hook-form";
import CourseForm from "../components/CourseForm";

interface CourseListCardProps {
  id: string;
  courseName: string;
  numberOfStudent: number;
}

function CourseListCard({
  id,
  courseName,
  numberOfStudent,
}: CourseListCardProps) {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <Link to={`/courses/${id}`}>
        <div className="flex flex-col justify-center h-full gap-1">
          <h5 className="secondary-color">{courseName}</h5>
          <h6> {numberOfStudent} students</h6>
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
      <div className="flex justify-end">
        <Button m={30} color="#15803d" onClick={open}>
          Create New Course
        </Button>
      </div>
      <Grid>
        {courses?.map(({ id, courseName, Students }, index) => (
          <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2 }}>
            <CourseListCard
              id={id.toString()}
              courseName={courseName}
              numberOfStudent={Students?.length}
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
        <FormProvider {...formMethods}>
          <CourseForm onSubmit={onSubmit} />
        </FormProvider>
      </Modal>
    </>
  );
}
