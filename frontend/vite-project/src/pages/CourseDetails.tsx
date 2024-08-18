import { Button, Paper, Table } from "@mantine/core";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
// import db from "../db";
import { Course } from "../sharedTypes";


export default function CourseDetails() {
  const courseDetails = useLoaderData() as Course;
  
  const {courseName, students} = courseDetails

  return (
    <div>
      <h4>{courseName}</h4>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6">
          <h6>Number of students enrolled: </h6>
          <p> 12</p>
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
              <Table.Th>Number of courses registered</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Etinosa</Table.Td>
              <Table.Td>Izekor</Table.Td>
              <Table.Td>20</Table.Td>
              <Table.Td>
                <Button color="#fc3f3f">Unenrol</Button>
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
        </Table>
      </Paper>
      {/* </Paper> */}
    </div>
  );
}

// export const fetchCourseDetails = async (id: string): Promise<Course | null> => {
//   const serverUrl = db.serverUrl;
//   console.log("Server URL:", serverUrl);
//   try {
//     const response = await axios.get(`${serverUrl}/courses/${id}`);
//     console.log(response);

//     return response.data;
//   } catch (err) {
//     console.error("Error fetching course:", err);
//     return null
//   }
// };
