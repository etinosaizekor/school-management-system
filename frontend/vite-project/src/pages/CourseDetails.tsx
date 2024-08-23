import {
  ActionIcon,
  Button,
  Modal,
  MultiSelect,
  Paper,
  Table,
  Tooltip,
} from "@mantine/core";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
// import db from "../db";
import { Course, CourseInfo, Student } from "../sharedTypes";
import { useEffect, useState } from "react";
import { calculateAge } from "../utils/dateUtils";
import { CgRemove } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  useDeleteCourseMutation,
  useEnrollStudentsMutation,
  useUnenrollStudentFromCourseMutation,
  useUpdateCourseMutation,
} from "../api/courseApi";
import { displayNotification } from "../components/notifications";
import { FormProvider, useForm } from "react-hook-form";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useLazyGetStudentsQuery } from "../api/studentApi";
import CourseForm from "../components/CourseForm";

export default function CourseDetails() {
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(useLoaderData() as Course);
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [studentToUnenroll, setStudentToUnenroll] = useState<number | null>(
    null
  );
  const [studentsToEnroll, setStudentsToEnroll] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<
    { value: string; label: string }[]
  >([]);
  const [
    isStudentModalOpen,
    { open: openStudentModal, close: closeStudentModal },
  ] = useDisclosure(false);
  const [isEditModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    confirmUnenrollOpened,
    { open: openConfirmUnenroll, close: closeConfirmUnenroll },
  ] = useDisclosure(false);

  const handleUnenrollClick = (studentId: number) => {
    console.log(studentId);
    setStudentToUnenroll(studentId);
    openConfirmUnenroll();
  };
  const { courseName, courseCode, credit, Students, id } = courseDetails;

  const formMethods = useForm<CourseInfo>({
    defaultValues: {
      courseName,
      courseCode,
      credit,
      studentIds: Students?.map((student) => student.id.toString()) || [],
    },
  });

  useEffect(() => {
    if (courseDetails) {
      setStudentsInClass(courseDetails?.Students);
    }
  }, [courseDetails]);

  const [enrollStudent, { isLoading: isEnrolling }] =
    useEnrollStudentsMutation();

  const [unenrollStudent, { isLoading: unenrolling }] =
    useUnenrollStudentFromCourseMutation();

  const confirmUnenroll = () => {
    if (studentToUnenroll !== null && courseDetails?.id) {
      console.log("Course id", courseDetails.id);

      unenrollStudent({
        courseId: courseDetails?.id,
        studentId: studentToUnenroll,
      })
        .unwrap()
        .then(() => {
          setStudentsInClass(
            studentsInClass?.filter(
              (student) => student.id != studentToUnenroll
            )
          );
          displayNotification({
            title: "Successful",
            message: "Student successfully unenrolled",
            type: "success",
          });
        })
        .catch((error) => {
          displayNotification({
            title: "Failed to unenroll student",
            message: error?.data?.message || "An error occurred",
            type: "error",
          });
        })
        .finally(() => {
          closeConfirmUnenroll();
        });
    }
  };

  const [
    confirmDeletion,
    { open: openDeleteConfirmation, close: closeDeleteConfirmation },
  ] = useDisclosure(false);

  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

  const handleDeletion = () => {
    deleteCourse(courseDetails?.id)
      .then(() => {
        closeDeleteConfirmation();
        navigate("/classes", { replace: true });
        displayNotification({
          title: "Success",
          message: "Class deleted successfully",
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

  const handleEnrolmentSubmission = (event: React.FormEvent) => {
    event.preventDefault();

    const ids = studentsToEnroll.map((studentId) => parseInt(studentId));

    enrollStudent({ courseId: id, studentId: ids })
      .unwrap()
      .then((data) => {
        setStudentsInClass(data);
        displayNotification({
          title: "Successful",
          message: `Student successfully enrolled in Class`,
          type: "success",
        });
        setStudentsToEnroll([]);
        closeStudentModal();
      })
      .catch((error) => {
        displayNotification({
          title: `Failed to enrol student`,
          message: error?.data?.message || "An error occurred. Try again",
          type: "error",
        });
      })
      .finally(() => {
        close();
      });
  };

  const [getStudents] = useLazyGetStudentsQuery();

  const prepareStudentSelectionList = () => {
    getStudents()
      .unwrap()
      .then((allStudentsList) => {
        const enrolledStudentIds = new Set(studentsInClass?.map((s) => s.id));

        setStudentList(
          allStudentsList.items?.map((studentInList) => ({
            value: studentInList?.id.toString(),
            label: `${studentInList?.firstName} ${studentInList?.lastName}`,
            disabled: enrolledStudentIds.has(studentInList?.id),
          }))
        );
      });
  };

  const handleOpenStudentList = () => {
    prepareStudentSelectionList();
    openStudentModal();
  };

  const [updateCourse] = useUpdateCourseMutation();

  const handleUpdateSubmission = (data: CourseInfo) => {
    const { studentIds } = data;
    const courseFormData = {
      ...data,
      studentIds: studentIds.map((courseId) => parseInt(courseId)),
    };

    updateCourse({
      id: courseDetails?.id,
      modifiedClassData: courseFormData,
    })
      .unwrap()
      .then((updatedCourseDetails) => {
        setCourseDetails(updatedCourseDetails);

        prepareStudentSelectionList();
        displayNotification({
          title: "Success",
          message: "Course updated successfully!",
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
      .finally(() => closeEditModal());
  };

  return (
    <div>
      <section className="flex justify-between mb-6">
        <div className="flex gap-8">
          <h4>Course Information</h4>
          <ActionIcon variant="subtle" onClick={openEditModal}>
            <MdModeEdit fontSize="20px" color="black" />
          </ActionIcon>
        </div>
        <ActionIcon variant="subtle" onClick={openDeleteConfirmation}>
          <MdDelete fontSize="20px" color="red" />
        </ActionIcon>
      </section>
      <h4>{courseName}</h4>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <section className="flex gap-6 justify-between">
          <span className="flex gap-5">
            <h6>Number of students enrolled: </h6>
            <p> {Students?.length}</p>
          </span>
          <Button onClick={handleOpenStudentList}>Add Student</Button>
        </section>
        {/* <Paper w="100%" mih={100}> */}
        <Table
          striped
          highlightOnHover
          withTableBorder
          className="w-full"
          mt={20}
          w="100%"
          bg="#f9f5f5"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Number of courses registered</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {studentsInClass?.map((student) => (
              <Table.Tr key={student.id}>
                <Table.Td>{student.firstName}</Table.Td>
                <Table.Td>{student.lastName}</Table.Td>
                <Table.Td>{calculateAge(student.dateOfBirth)}</Table.Td>
                <Table.Td>
                  <Tooltip label="Unenroll Student" position="top" withArrow>
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      onClick={() => handleUnenrollClick(student.id)}
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
      <ConfirmationModal
        opened={confirmUnenrollOpened}
        onClose={closeConfirmUnenroll}
        title="Confirm Unenrollment"
        confirmationMessage="Are you sure you want to unenroll this student"
        onConfirm={confirmUnenroll}
        loading={unenrolling}
      />
      <ConfirmationModal
        opened={confirmDeletion}
        onClose={closeDeleteConfirmation}
        title="Confirm Deletion"
        confirmationMessage="Are you sure you want to delete this class"
        onConfirm={handleDeletion}
        loading={deleting}
      />
      <Modal
        opened={isStudentModalOpen}
        onClose={closeStudentModal}
        title="Enrol Student to course"
        size="lg"
        padding={30}
      >
        <form onSubmit={handleEnrolmentSubmission}>
          <MultiSelect
            data={studentList}
            value={studentsToEnroll}
            placeholder="Select Students"
            searchable
            onChange={setStudentsToEnroll}
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
      <Modal
        opened={isEditModalOpened}
        onClose={closeEditModal}
        title="Edit Class Information"
        size="lg"
      >
        <FormProvider {...formMethods}>
          <CourseForm onSubmit={handleUpdateSubmission} mode="edit" />
        </FormProvider>
      </Modal>
    </div>
  );
}
