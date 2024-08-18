import { Button, Paper, Table, Tooltip } from "@mantine/core";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import db from "../db";
import { Student } from "../sharedTypes";
import { CgRemove } from "react-icons/cg";

function StudentDetail({ label, value }: { label: string; value: any }) {
  return (
    <span className="flex gap-6 justify-between items-center">
      <span className="flex-1">
        <h6>{label} </h6>
      </span>
      <span className="flex-1">
        <p>{value}</p>
      </span>
    </span>
  );
}

export default function StudentDetails() {
  const studentDetails = useLoaderData() as Student | null;

  return (
    <div>
      <div className="w-60 mb-10">
        <StudentDetail label="First name" value={studentDetails?.firstName} />
        <StudentDetail label="Last name" value={studentDetails?.lastName} />
        <StudentDetail label="Age" value={studentDetails?.age} />
      </div>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6 justify-between">
          <>
            <h6>Number of courses enrolled: </h6>
            <p> {studentDetails?.Courses.length}</p>
          </>

          <Button>Add Course</Button>
        </span>
        {/* <Paper w="100%" mih={100}> */}
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
              <Table.Th>Credit </Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
            {studentDetails?.Courses.map(
              ({ courseName, credit, courseCode }) => (
                <Table.Tr>
                  <Table.Td>{courseCode}</Table.Td>
                  <Table.Td>{courseName}</Table.Td>
                  <Table.Td>{credit}</Table.Td>
                  <Table.Td>
                    <Tooltip label="Unenrol" position="top" withArrow>
                      <Button variant="outline" color="red" size="xs">
                        <CgRemove fontSize={20} />
                      </Button>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              )
            )}
          </Table.Thead>
        </Table>
      </Paper>
      {/* </Paper> */}
    </div>
  );
}

export const fetchStudentDetails = async (
  id: string
): Promise<Student | null> => {
  const serverUrl = db.serverUrl;
  console.log("Server URL:", serverUrl);
  try {
    const response = await axios.get(`${serverUrl}/students/${id}`);
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Error fetching studentes:", err);
    return null;
  }
};
