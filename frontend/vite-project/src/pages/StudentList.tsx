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
import {
  Class,
  Course,
  FindQueryResult,
  Student,
  StudentInfo,
} from "../sharedTypes";
import { FormProvider, useForm } from "react-hook-form";
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
import StudentForm from "../components/StudentForm";
import { displayNotification } from "../components/notifications";

interface StudentListCardProps {
  id: number;
  firstName: string;
  classId: string;
  numberOfCoursesEnrolled: number;
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
  const formMethods = useForm<StudentInfo>();
  const { reset } = formMethods;
  const [createStudent] = useCreateStudentMutation();

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex justify-end">
        <Button m={30} color="#15803d" onClick={open}>
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
        <FormProvider {...formMethods}>
          <StudentForm onSubmit={onSubmit} />
        </FormProvider>
      </Modal>
    </>
  );
}
