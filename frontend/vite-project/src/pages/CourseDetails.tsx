import {
  ActionIcon,
  Button,
  Loader,
  Modal,
  Paper,
  Table,
  Tooltip,
} from "@mantine/core";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Course, CourseInfo, Student } from "../sharedTypes";
import { useEffect, useState } from "react";
import { calculateAge } from "../utils/dateUtils";
import { CgRemove } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  useDeleteCourseMutation,
  useEnrollStudentsMutation,
  useGetCourseByIdQuery,
  useUnenrollStudentFromCourseMutation,
  useUpdateCourseMutation,
} from "../api/courseApi";
import { displayNotification } from "../components/notifications";
import { FormProvider, useForm } from "react-hook-form";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useLazyGetStudentsQuery } from "../api/studentApi";
import CourseForm from "../components/CourseForm";
import LabelValuePair from "../components/LabelValuePair";
import { useParams } from "react-router-dom";
import CenterContainer from "../components/CenterContainer";
import StudentEnrollmentForm from "../components/StudentEnrollmentForm";

export default function CourseDetails() {
  const { courseId } = useParams();

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchCourseDetails,
  } = useGetCourseByIdQuery(courseId);
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(useLoaderData() as Course);
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [studentToUnenroll, setStudentToUnenroll] = useState<number | null>(
    null
  );
  const [studentsEnrolled, setStudentsEnrolled] = useState<string[]>([]);
  const [updateError, setUpdateError] = useState("");

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
    setStudentToUnenroll(studentId);
    openConfirmUnenroll();
  };

  useEffect(() => {
    refetch: refetchCourseDetails();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setCourseDetails(data);
      setStudentsInClass(data.Students);
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

  const formMethods = useForm<CourseInfo>({});

  useEffect(() => {
    if (courseDetails) {
      formMethods.reset({
        courseName: courseDetails.courseName,
        courseCode: courseDetails.courseCode,
        credit: courseDetails.credit,
        studentIds: courseDetails.Students
          ? courseDetails.Students.map((student) => student.id.toString())
          : [],
      });
    }
  }, [courseDetails, formMethods]);

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
        navigate("/courses", { replace: true });
        displayNotification({
          title: "Success",
          message: "Course deleted successfully",
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

  const handleEnrolmentSubmission = (studentsToEnroll: string[]) => {
    const ids = studentsToEnroll.map((studentId) => parseInt(studentId));

    enrollStudent({ courseId: courseDetails?.id, studentId: ids })
      .unwrap()
      .then((data) => {
        setStudentsInClass(data);
        displayNotification({
          title: "Successful",
          message: `Student successfully enrolled in Class`,
          type: "success",
        });
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
      .then(() => {
        const enrolledStudentIds = new Set(
          studentsInClass?.map((s) => s.id.toString())
        );
        setStudentsEnrolled(Array.from(enrolledStudentIds));
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
        setUpdateError("");
        closeEditModal();
      })
      .catch((error) => {
        const err = error?.data?.message;
        setUpdateError(err);
      });
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
          <h4>Course Information</h4>
          <ActionIcon variant="subtle" onClick={openEditModal}>
            <MdModeEdit fontSize="20px" color="black" />
          </ActionIcon>
        </div>
        <ActionIcon variant="subtle" onClick={openDeleteConfirmation}>
          <MdDelete fontSize="20px" color="red" />
        </ActionIcon>
      </section>
      <div className="mb-10">
        <LabelValuePair label="Course name" value={courseDetails?.courseName} />
        <LabelValuePair label="Course code" value={courseDetails?.courseCode} />
        <LabelValuePair label="Credit" value={courseDetails?.credit} />
      </div>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <section className="flex gap-6 justify-between">
          <span className="flex gap-5">
            <h6>Number of students enrolled: </h6>
            <p> {courseDetails?.Students?.length}</p>
          </span>
          <Button onClick={handleOpenStudentList}>Add Student</Button>
        </section>
        <Table
          striped
          highlightOnHover
          withTableBorder
          className="w-full"
          mt={20}
          w="100%"
          bg="#fff"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Age</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {studentsInClass.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} className="text-center">
                  No students available
                </Table.Td>
              </Table.Tr>
            ) : (
              studentsInClass.map((student) => (
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
              ))
            )}
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

      <StudentEnrollmentForm
        isEnrolling={isEnrolling}
        isOpened={isStudentModalOpen}
        onClose={closeStudentModal}
        onEnrollmentSubmission={handleEnrolmentSubmission}
        initialData={studentsEnrolled}
      />
      <Modal
        opened={isEditModalOpened}
        onClose={closeEditModal}
        title="Edit Class Information"
        size="lg"
      >
        <FormProvider {...formMethods}>
          <CourseForm
            onSubmit={handleUpdateSubmission}
            mode="edit"
            errorMessage={updateError}
          />
        </FormProvider>
      </Modal>
    </div>
  );
}
