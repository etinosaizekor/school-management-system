import { Button, Paper, Table } from "@mantine/core";

export default function ClassDetails() {
  return (
    <div>
      <h4>Object Oriented Programming II</h4>

      <Paper w="100%" mih={200} bg="#b6c4dd" p={20} mt={10}>
        <span className="flex gap-6">
          <h6>Number of students enrolled: </h6>
          <p> 12</p>
        </span>
        {/* <Paper w="100%" mih={100}> */}
        <Table striped highlightOnHover withTableBorder className="w-full" mt={20} w="100%" bg="#f9f5f5">
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
               <Table.Td><Button color="#fc3f3f">Unenrol</Button></Table.Td>
            </Table.Tr>
          </Table.Thead>
        </Table>
      </Paper>
      {/* </Paper> */}
    </div>
  );
}
