import { ActionIcon, Button, Paper, Table, Tooltip } from "@mantine/core";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { Class } from "../sharedTypes";
import { calculateAge } from "../utils/dateUtils";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../components/ConfirmationModal";
import { CgRemove } from "react-icons/cg";
import { useUnenrollStudentMutation } from "../api/classApi";
import { displayNotification } from "../components/notifications";

export default function ClassDetails() {
  const classDetails = useLoaderData() as Class;
  const [students, setStudents] = useState(classDetails?.Students);
  const [studentToUnenroll, setStudentToUnenroll] = useState<number | null>(
    null
  );
  const [
    confirmUnenrollOpened,
    { open: openConfirmUnenroll, close: closeConfirmUnenroll },
  ] = useDisclosure(false);

  const [unenrollStudent, { isLoading: isUnenrolling }] =
    useUnenrollStudentMutation();

  const { className, Students } = classDetails;

  const handleUnenroll = (studentId: number) => {
    setStudentToUnenroll(studentId);
    openConfirmUnenroll();
  };

  const confirmUnenroll = () => {
    if (studentToUnenroll !== null) {
      unenrollStudent({
        classId: classDetails?.id,
        studentIds: studentToUnenroll,
      })
        .unwrap()
        .then(() => {
          console.log();

          setStudents(
            students.filter((student) => student.id != studentToUnenroll)
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

  return (
    <div>
      <h4>{className}</h4>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6">
          <>
            <h6>Number of students enrolled: </h6>
            <p> {Students.length}</p>
          </>
        </span>
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
              <Table.Th>Age</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {students?.map((student) => (
              <Table.Tr>
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
        loading={isUnenrolling}
      />
    </div>
  );
}
