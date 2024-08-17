import { Button, Paper, Table } from "@mantine/core";
import axios from "axios";
import { useLoaderData, useParams } from "react-router-dom";
import db from "../db";

export default function ClassDetails() {
  const classDetails = useLoaderData();
  const {className, students} = classDetails

  return (
    <div>
      <h4>{className}</h4>

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

export const fetchClassDetails = async (id: string) => {
  const serverUrl = db.serverUrl;
  console.log("Server URL:", serverUrl);
  try {
    const response = await axios.get(`${serverUrl}/classes/${id}`);
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Error fetching classes:", err);
    return null
  }
};
