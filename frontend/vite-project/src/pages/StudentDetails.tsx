import {
  ActionIcon,
  Button,
  Modal,
  MultiSelect,
  Paper,
  Table,
  Tooltip,
} from "@mantine/core";
import {
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Student } from "../sharedTypes";
import { CgRemove } from "react-icons/cg";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import {
  useUnenrollCoursesMutation,
  useEnrollCoursesMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from "../api/studentApi";
import { useLazyGetCoursesQuery } from "../api/courseApi";
import ConfirmationModal from "../components/ConfirmationModal";
import { displayNotification } from "../components/notifications";
import { useRevalidator } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import StudentForm from "../components/StudentForm";
import { FormProvider, useForm } from "react-hook-form";
import { StudentInfo } from "../sharedTypes";

function StudentDetail({ label, value }: { label: string; value: any }) {
  return (
    <span className="flex gap-6 justify-between items-center">
      <span className="flex-1">
        <h6>{label}</h6>
      </span>
      <span className="flex-1">
        <p>{value}</p>
      </span>
    </span>
  );
}

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = useState(
    useLoaderData() as Student | null
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [courses, setCourses] = useState(studentDetails?.Courses);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [enrollCourses, { isLoading: isEnrolling }] =
    useEnrollCoursesMutation();
  const [unenrollCourse, { isLoading: isUnenrolling }] =
    useUnenrollCoursesMutation();
  const [
    getCourses,
    { isLoading, isSuccess: isGetCoursesSuccess, data: coursesData },
  ] = useLazyGetCoursesQuery();
  const [courseToUnenroll, setCourseToUnenroll] = useState<number | null>(null);
  const [
    confirmUnenrollOpened,
    { open: openConfirmUnenroll, close: closeConfirmUnenroll },
  ] = useDisclosure(false);
  const [
    confirmStudentDeletion,
    { open: openConfirmDeletion, close: closeConfirmDeletion },
  ] = useDisclosure(false);
  const [deleteStudent, { isLoading: isDeletionLoading }] =
    useDeleteStudentMutation();
  const formMethods = useForm<StudentInfo>({
    defaultValues: {
      firstName: studentDetails?.firstName || "",
      lastName: studentDetails?.lastName || "",
      dateOfBirth: new Date() || "",
      courseIds:
        studentDetails?.Courses.map((course) => course.id.toString()) || [],
      classId: (studentDetails?.classId as any) || "",
    },
  });
  const { reset } = formMethods;

  const navigate = useNavigate();
  const location = useLocation();
  const revalidator = useRevalidator();

  useEffect(() => {
    // Trigger revalidation or refetch when the location changes
    revalidator.revalidate(); // This assumes revalidator is properly hooked up to your routes
  }, [location.pathname]); // Dependency on location.pathname ensures revalidation on route changes

  useEffect(() => {
    if (coursesData) {
      const allCourses = coursesData?.items || [];
      const enrolledCourseIds = studentDetails?.Courses.map((course) =>
        course.id.toString()
      );

      const availableCourses = allCourses.filter(
        (course) => !enrolledCourseIds?.includes(course.id.toString())
      );

      const courseData = availableCourses.map((course) => ({
        value: course.id.toString(),
        label: course.courseName,
      }));

      setCourseOptions(courseData);
    }
  }, [isGetCoursesSuccess, coursesData, studentDetails?.Courses]);

  const handleOpen = () => {
    if (courseOptions.length === 0) {
      getCourses();
    }
    open();
  };

  useEffect(() => {
    console.log(courseIds);
  }, [courseIds]);

  const handleSubmit = () => {
    const courseText = courseIds.length === 1 ? "course" : "courses";
    const ids = courseIds.map((courseId) => Number(courseId));
    console.log("ids", ids);

    enrollCourses({ studentId: studentDetails?.id, courseIds: ids })
      .unwrap()
      .then((data) => {
        setCourses(data);
        notifications.show({
          title: "Successful",
          message: `Student successfully enrolled in ${courseText}`,
          icon: <FaCheck />,
          color: "teal",
          position: "top-right",
        });
        setCourseIds([]);
      })
      .catch((error) => {
        notifications.show({
          title: `Failed to enrol ${courseText}`,
          message: error?.data?.message || "An error occurred",
          icon: <FaTimes />,
          color: "red",
          position: "top-right",
        });
      })
      .finally(() => {
        close();
      });
  };

  const handleUnenroll = (courseId: number) => {
    setCourseToUnenroll(courseId);
    openConfirmUnenroll();
  };

  const confirmUnenroll = () => {
    if (courseToUnenroll !== null) {
      unenrollCourse({
        studentId: studentDetails?.id,
        courseId: courseToUnenroll,
      })
        .unwrap()
        .then((data) => {
          setCourses(data);
          // notifications.show({
          //   title: "Successful",
          //   message: "Course successfully unenrolled",
          //   icon: <FaCheck />,
          //   color: "teal",
          //   position: "top-right",
          // });\
          displayNotification({
            title: "Successful",
            message: "Course successfully unenrolled",
            type: "success",
          });
        })
        .catch((error) => {
          displayNotification({
            title: "Failed to unenroll course",
            message: error?.data?.message || "An error occurred",
            type: "error",
          });
        })
        .finally(() => {
          closeConfirmUnenroll();
        });
    }
  };

  const handleStudentDeletion = () => {
    deleteStudent(studentDetails?.id)
      .then(() => {
        closeConfirmDeletion();
        navigate("/students", { replace: true });
        displayNotification({
          title: "Sucess",
          message: "Student deleted successfully",
          type: "success",
        });
      })
      .catch((error) => {
        displayNotification({
          title: "Deletion failed",
          message: error?.data?.message || "An error occurred",
          type: "error",
        });
      });
  };

  const [updateStudent] = useUpdateStudentMutation();

  const onSubmit = async (data: StudentInfo) => {
    console.log(data);
    const { courseIds, classId } = data;
    const studentFormData = {
      ...data,
      courseIds: courseIds.map((courseId) => parseInt(courseId)),
      classId: parseInt(classId),
    };

    updateStudent({
      id: studentDetails?.id!,
      modifiedStudentData: studentFormData,
    })
      .unwrap()
      .then((updatedStudentDetails) => {
        setStudentDetails(updatedStudentDetails);

        displayNotification({
          title: "Success",
          message: "Student updated successfully!",
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
    <div>
      <section className="flex justify-between mb-6">
        <div className="flex gap-8">
          <h4>Student Information</h4>
          <ActionIcon variant="subtle" onClick={open}>
            <MdModeEdit fontSize="20px" color="black" />
          </ActionIcon>
        </div>
        <ActionIcon variant="subtle" onClick={openConfirmDeletion}>
          <MdDelete fontSize="20px" color="red" />
        </ActionIcon>
      </section>
      <div className="w-60 mb-10">
        <StudentDetail label="First name" value={studentDetails?.firstName} />
        <StudentDetail label="Last name" value={studentDetails?.lastName} />
        <StudentDetail label="Age" value={studentDetails?.age} />
      </div>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6 justify-between">
          <>
            <h6>Number of courses enrolled: </h6>
            <p>{studentDetails?.Courses.length}</p>
          </>
          <Button onClick={handleOpen}>Add Course</Button>
        </span>
        <Table
          striped
          highlightOnHover
          withTableBorder
          className="w-full"
          mt={20}
          w="100%"
          bg="#ffffff"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course Code</Table.Th>
              <Table.Th>Course Name</Table.Th>
              <Table.Th>Credit</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {courses?.map(({ courseName, credit, courseCode, id }) => (
              <Table.Tr key={courseCode}>
                <Table.Td>{courseCode}</Table.Td>
                <Table.Td>{courseName}</Table.Td>
                <Table.Td>{credit}</Table.Td>
                <Table.Td>
                  <Tooltip label="Unenroll" position="top" withArrow>
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      onClick={() => handleUnenroll(id)}
                    >
                      <CgRemove fontSize={20} />
                    </Button>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* <Modal
        opened={opened}
        onClose={close}
        title="Enroll Student to course"
        size="lg"
        padding={30}
      >
        <form onSubmit={handleSubmit}>
          <MultiSelect
            data={courseOptions}
            value={courseIds}
            placeholder="Select courses"
            searchable
            onChange={setCourseIds}
          />
          <Button
            type="submit"
            mt={10}
            radius={20}
            color="#15803d"
            loading={isEnrolling}
          >
            Submit
          </Button>
        </form>
      </Modal> */}

      {/* <StudentForm onSubmit={handleSubmit}/> */}

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

      <ConfirmationModal
        opened={confirmUnenrollOpened}
        onClose={closeConfirmUnenroll}
        title="Confirm Unenrollment"
        confirmationMessage="Are you sure you want to unenroll this course"
        onConfirm={confirmUnenroll}
        loading={isUnenrolling}
      />
      <ConfirmationModal
        opened={confirmStudentDeletion}
        onClose={closeConfirmDeletion}
        title="Confirm Deletion"
        confirmationMessage="Are you sure you want to delete this student"
        onConfirm={handleStudentDeletion}
        loading={isDeletionLoading}
      />
    </div>
  );
}
