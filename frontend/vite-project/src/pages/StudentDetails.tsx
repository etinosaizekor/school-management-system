import {
  ActionIcon,
  Button,
  Loader,
  Modal,
  MultiSelect,
  Paper,
  Table,
  Tooltip,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Student } from "../sharedTypes";
import { CgRemove } from "react-icons/cg";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { MdDelete } from "react-icons/md";

import {
  useUnenrollCoursesMutation,
  useEnrollCoursesMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
  useGetStudentQuery,
} from "../api/studentApi";
import { useLazyGetCoursesQuery } from "../api/courseApi";
import ConfirmationModal from "../components/ConfirmationModal";
import { displayNotification } from "../components/notifications";
import { MdModeEdit } from "react-icons/md";
import StudentForm from "../components/StudentForm";
import { FormProvider, useForm } from "react-hook-form";
import { StudentInfo } from "../sharedTypes";
import { calculateAge } from "../utils/dateUtils";
import dayjs from "dayjs";
import LabelValuePair from "../components/LabelValuePair";
import CenterContainer from "../components/CenterContainer";

export default function StudentDetails() {
  const { studentId } = useParams();

  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const { data, isLoading, isSuccess, isError, error } =
    useGetStudentQuery(studentId);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    isCourseEnrolmentModalOpen,
    { open: openCourseEnrolmentModal, close: closeCourseEnrolmentModal },
  ] = useDisclosure(false);

  const [courses, setCourses] = useState(studentDetails?.Courses);
  const [coursesToEnrol, setCoursesToEnrol] = useState<string[]>([]);

  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [enrollCourses, { isLoading: isEnrolling }] =
    useEnrollCoursesMutation();
  const [unenrollCourse, { isLoading: isUnenrolling }] =
    useUnenrollCoursesMutation();
  const [getCourses, { isSuccess: isGetCoursesSuccess, data: coursesData }] =
    useLazyGetCoursesQuery();
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

  const formMethods = useForm<StudentInfo>();

  useEffect(() => {
    if (studentDetails) {
      const { firstName, lastName, dateOfBirth, Class, Courses } =
        studentDetails;

      formMethods.reset({
        firstName: firstName || "",
        lastName: lastName || "",
        dateOfBirth:
          (dateOfBirth && dayjs(dateOfBirth).format("YYYY-MM-DD")) || "",
        courseIds: Courses ? Courses.map((course) => course.id.toString()) : [],
        classId: Class ? studentDetails.Class.id.toString() : "",
      });
    }
  }, [studentDetails, formMethods]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && data) {
      setStudentDetails(data);
      setCourses(data.Courses);
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

  useEffect(() => {
    if (coursesData) {
      const allCourses = coursesData?.items || [];
      const enrolledCourseIds = studentDetails?.Courses.map((course) =>
        course.id.toString()
      );

      const courseData = allCourses.map((course) => ({
        value: course.id.toString(),
        label: course.courseName,
        disabled: enrolledCourseIds?.includes(course.id.toString()), // Disable already enrolled courses
      }));

      setCourseOptions(courseData);
    }
  }, [isGetCoursesSuccess, coursesData, studentDetails?.Courses]);

  const handleCourseModalOpen = () => {
    if (courseOptions.length === 0) {
      getCourses();
    }
    openCourseEnrolmentModal();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const courseText = coursesToEnrol.length === 1 ? "course" : "courses";
    const ids = coursesToEnrol.map((courseId) => Number(courseId));

    enrollCourses({ studentId: studentDetails?.id, courseIds: ids })
      .unwrap()
      .then((data) => {
        setCourses(data);
        displayNotification({
          title: "Successful",
          message: `Student successfully enrolled in ${courseText}`,
          type: "success",
        });
        setCoursesToEnrol([]);
        closeCourseEnrolmentModal();
      })
      .catch((error) => {
        displayNotification({
          title: `Failed to enrol ${courseText}`,
          message: error?.data?.message || "An error occurred",
          type: "error",
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
          title: "Success",
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
      <CenterContainer>
        <Loader fontSize={500} />;
      </CenterContainer>
    );

  return (
    <div>
      <section className="flex justify-between m-6 ml-0">
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
      <div className="w-72 mb-10">
        <LabelValuePair label="First name" value={studentDetails?.firstName} />
        <LabelValuePair label="Last name" value={studentDetails?.lastName} />
        <LabelValuePair
          label="Class"
          value={studentDetails?.Class?.className}
        />
        <LabelValuePair
          label="Age"
          value={
            studentDetails?.dateOfBirth
              ? calculateAge(studentDetails.dateOfBirth)
              : ""
          }
        />
      </div>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6 justify-between">
          <span className="flex gap-5">
            <h6>Number of courses enrolled: </h6>
            <p>{studentDetails?.Courses.length}</p>
          </span>
          <Button onClick={handleCourseModalOpen}>Add Course</Button>
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
            {courses?.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} className="text-center">
                  No courses available
                </Table.Td>
              </Table.Tr>
            ) : (
              courses?.map(({ courseName, credit, courseCode, id }) => (
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
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
      {/* <Modal
        
        title="Edit Student Information"
        size="lg"
      > */}
      <FormProvider {...formMethods}>
        <StudentForm
          onSubmit={onSubmit}
          isOpen={opened}
          close={close}
          isSubmitting={isLoading}
        />
      </FormProvider>
      {/* </Modal> */}
      <Modal
        opened={isCourseEnrolmentModalOpen}
        onClose={closeCourseEnrolmentModal}
        title="Enrol Student to courses"
        size="lg"
        padding={30}
      >
        <form onSubmit={handleSubmit}>
          <MultiSelect
            data={courseOptions}
            value={coursesToEnrol}
            placeholder="Select courses"
            searchable
            onChange={setCoursesToEnrol}
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
