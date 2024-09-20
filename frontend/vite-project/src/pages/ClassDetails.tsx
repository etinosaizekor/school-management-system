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
import { Class, ClassInfo, Student } from "../sharedTypes";
import { calculateAge } from "../utils/dateUtils";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../components/ConfirmationModal";
import { CgRemove } from "react-icons/cg";
import {
  useDeleteClassMutation,
  useEnrollStudentMutation,
  useGetClassByIdQuery,
  useUnenrollStudentMutation,
  useUpdateClassMutation,
} from "../api/classApi";
import { displayNotification } from "../components/notifications";
import { useLazyGetStudentsQuery } from "../api/studentApi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FormProvider, useForm } from "react-hook-form";
import ClassForm from "../components/ClassForm";
import CenterContainer from "../components/CenterContainer";
import { toSentenceCase } from "../utils/textUtils";

export default function ClassDetails() {
  const [classDetails, setClassDetails] = useState<Class | null>(null);
  const { classId } = useParams();
  const { data, isLoading, isSuccess, isError, error } =
    useGetClassByIdQuery(classId);

  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [studentToUnenroll, setStudentToUnenroll] = useState<number | null>(
    null
  );
  const [studentsToEnroll, setStudentsToEnroll] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<
    { value: string; label: string }[]
  >([]);
  const [
    confirmUnenrollOpened,
    { open: openConfirmUnenroll, close: closeConfirmUnenroll },
  ] = useDisclosure(false);
  const [isEditModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    confirmDeletion,
    { open: openDeleteConfirmation, close: closeDeleteConfirmation },
  ] = useDisclosure(false);
  const [
    isStudentModalOpen,
    { open: openStudentModal, close: closeStudentModal },
  ] = useDisclosure(false);

  const [enrollStudent, { isLoading: isEnrolling }] =
    useEnrollStudentMutation();
  const [unenrollStudent, { isLoading: isUnenrolling }] =
    useUnenrollStudentMutation();
  const [updateError, setUpdateError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && data) {
      setClassDetails(data);
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

  const handleUnenroll = (studentId: number) => {
    setStudentToUnenroll(studentId);
    openConfirmUnenroll();
  };

  const confirmUnenroll = () => {
    if (studentToUnenroll !== null) {
      unenrollStudent({
        classId: classDetails?.id,
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

  const [getStudents] = useLazyGetStudentsQuery();

  const handleOpen = () => {
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
    openStudentModal();
  };

  const handleEnrolmentSubmission = (event: React.FormEvent) => {
    event.preventDefault();

    const ids = studentsToEnroll.map((studentId) => parseInt(studentId));

    enrollStudent({ classId: classDetails?.id, studentId: ids })
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

  const formMethods = useForm<ClassInfo>({});

  useEffect(() => {
    if (classDetails) {
      formMethods.reset({
        className: classDetails.className,
        studentIds:
          classDetails.Students?.map((student) => student.id.toString()) || [],
      });
    }
  }, [classDetails, formMethods]);

  const [updateClass] = useUpdateClassMutation();

  const handleUpdateSubmission = (data: ClassInfo) => {
    const { studentIds } = data;
    const classFormData = {
      ...data,
      studentIds: studentIds.map((courseId) => parseInt(courseId)),
    };

    updateClass({
      id: classDetails?.id!,
      modifiedClassData: classFormData,
    })
      .unwrap()
      .then((updatedClassDetails) => {
        setClassDetails(updatedClassDetails);
        setStudentsInClass(updatedClassDetails?.Students);
        displayNotification({
          title: "Success",
          message: "Student updated successfully!",
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

  useEffect(() => {
    if (classDetails) {
      setStudentsInClass(classDetails?.Students);
    }
  }, [classDetails]);

  const [deleteClass, { isLoading: deleting }] = useDeleteClassMutation();

  const handleDeletion = () => {
    deleteClass(classDetails?.id)
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
          <h4>Class Information</h4>
          <ActionIcon variant="subtle" onClick={openEditModal}>
            <MdModeEdit fontSize="20px" color="black" />
          </ActionIcon>
        </div>
        <ActionIcon variant="subtle" onClick={openDeleteConfirmation}>
          <MdDelete fontSize="20px" color="red" />
        </ActionIcon>
      </section>
      <h4>{toSentenceCase(classDetails?.className)}</h4>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <section className="flex gap-6 justify-between">
          <span className="flex gap-5">
            <h6>Number of students enrolled: </h6>
            <p> {classDetails?.Students?.length}</p>
          </span>
          <Button onClick={handleOpen}>Add Student</Button>
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
                        onClick={() => handleUnenroll(student.id)}
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
        loading={isUnenrolling}
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

      <FormProvider {...formMethods}>
        <ClassForm
          onSubmit={handleUpdateSubmission}
          mode="edit"
          errorMessage={updateError}
        />
      </FormProvider>
    </div>
  );
}
