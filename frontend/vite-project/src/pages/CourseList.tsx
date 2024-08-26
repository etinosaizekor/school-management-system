import { Button, Grid, Loader, Modal, Paper } from "@mantine/core";
import { Link } from "react-router-dom";
import { Course, CourseInfo } from "../sharedTypes";
import { useCreateCourseMutation, useGetCoursesQuery } from "../api/courseApi";
import { useEffect, useState } from "react";
import { displayNotification } from "../components/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FormProvider, useForm } from "react-hook-form";
import CourseForm from "../components/CourseForm";
import { GoPerson } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";
import NoEntity from "../components/NoEntity";

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
  const [creationError, setCreationError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isSuccess && data) {
      setCourses(data.items);
      setLoaded(true);
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
    const { studentIds } = data;
    const studentFormData = {
      ...data,
      studentIds: studentIds
        ? studentIds?.map((studentId) => parseInt(studentId))
        : [],
    };

    createCourse(studentFormData)
      .unwrap()
      .then((newCourse) => {
        setCourses([...courses, newCourse]);

        displayNotification({
          title: "Success",
          message: "Course created successfully!",
          type: "success",
        });
        setCreationError("");
        reset();
        close();
      })
      .catch((error) => {
        const err = error?.data?.message;
        setCreationError(err);
      });
  };

  if (isLoading)
    return (
      <div className=" flex w-full justify-center pt-24">
        <Loader fontSize={500} />;
      </div>
    );

  return (
    <>
      <div className="flex justify-between align-middle m-6 ml-0">
        <h3>Courses</h3>
        <Button color="#15803d" onClick={open}>
          Create New Course
        </Button>
      </div>
      {loaded && courses.length === 0 ? (
        <NoEntity
          Icon={<HiOutlineBookOpen fontSize={200} />}
          createNewText="Create New course"
          message="No courses available"
          onCreate={open}
        />
      ) : (
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
      )}

      <Modal
        opened={opened}
        onClose={close}
        title="Create New Course"
        size="lg"
      >
        <FormProvider {...formMethods}>
          <CourseForm onSubmit={onSubmit} errorMessage={creationError} />
        </FormProvider>
      </Modal>
    </>
  );
}
