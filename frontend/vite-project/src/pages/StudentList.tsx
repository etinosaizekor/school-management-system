import { Button, Grid, Paper, Modal, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Student, StudentInfo } from "../sharedTypes";
import { FormProvider, useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import {
  useCreateStudentMutation,
  useGetStudentsQuery,
} from "../api/studentApi";
import StudentForm from "../components/StudentForm";
import { displayNotification } from "../components/notifications";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import NoEntity from "../components/NoEntity";

interface StudentListCardProps {
  id: number;
  firstName: string;
  lastName: string;
  className: string;
  numberOfCoursesEnrolled: number;
}

function StudentListCard({
  id,
  firstName,
  lastName,
  className,
  numberOfCoursesEnrolled,
}: StudentListCardProps) {
  return (
    <Link to={`/students/${id}`}>
      <Paper w={300} h={130} p={10} className="border border-gray-400">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="secondary-color">{`${firstName} ${lastName}`}</h5>
            <p className="secondary-color">{className}</p>
          </div>
          <CgProfile fontSize={25} />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <HiOutlineBookOpen fontSize={20} />
          <h6 className="text-sm">{numberOfCoursesEnrolled} Courses</h6>
        </div>
      </Paper>
    </Link>
  );
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const { data, isLoading, isSuccess } = useGetStudentsQuery();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isSuccess && data) {
      setStudents(data.items);
      setLoaded(true);
    }
  }, [isSuccess, data]);

  const [opened, { open, close }] = useDisclosure(false);
  const formMethods = useForm<StudentInfo>();
  const { reset } = formMethods;
  const [createStudent] = useCreateStudentMutation();

  const onSubmit = async (data: StudentInfo) => {
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

  if (isLoading)
    return (
      <div className=" flex w-full justify-center pt-24">
        <Loader fontSize={500} />;
      </div>
    );

  return (
    <>
      <div className="flex justify-between align-middle m-6 ml-0">
        <h3>Student</h3>

        <Button color="#15803d" onClick={open}>
          Create New Student
        </Button>
      </div>
      {loaded && students.length === 0 ? (
        <NoEntity
          Icon={<IoPersonOutline fontSize={200} />}
          createNewText="Create New Student"
          message="No Students available"
          onCreate={open}
        />
      ) : (
        <Grid>
          {students?.map(
            ({ id, firstName, lastName, Courses, Class }, index) => (
              <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2.4 }}>
                <StudentListCard
                  id={id}
                  firstName={firstName}
                  lastName={lastName}
                  numberOfCoursesEnrolled={Courses?.length || 0}
                  className={Class?.className}
                />
              </Grid.Col>
            )
          )}
        </Grid>
      )}

      <FormProvider {...formMethods}>
        <StudentForm
          isOpen={opened}
          close={close}
          onSubmit={onSubmit}
          isSubmitting={isLoading}
        />
      </FormProvider>
    </>
  );
}
