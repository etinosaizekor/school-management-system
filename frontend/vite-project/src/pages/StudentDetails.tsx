import {
  Button,
  Modal,
  MultiSelect,
  Paper,
  Table,
  Tooltip,
} from "@mantine/core";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import db from "../db";
import { Student } from "../sharedTypes";
import { CgRemove } from "react-icons/cg";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FaCheck, FaTimes } from "react-icons/fa"; // Importing the success and error icons from react-icons

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
  const studentDetails = useLoaderData() as Student | null;
  const [opened, { open, close }] = useDisclosure(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${db.serverUrl}/courses`); // Adjust the URL as needed
      const allCourses = response?.data?.items || [];

      // Get the IDs of the courses the student is already enrolled in
      const enrolledCourseIds = studentDetails?.Courses.map((course) =>
        course.id.toString()
      );

      // Filter the courses to only include those not already enrolled
      const availableCourses = allCourses.filter(
        (course: any) => !enrolledCourseIds?.includes(course.id.toString())
      );

      // Map to the structure required by MultiSelect
      const courseData = availableCourses.map((course: any) => ({
        value: course.id.toString(),
        label: course.courseName,
      }));

      setCourseOptions(courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpen = () => {
    if (courseOptions.length === 0) {
      fetchCourses();
    }
    open();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state to true
    const courseText = courses.length === 1 ? "course" : "courses";
    const courseIds = courses.map((courseId) => Number(courseId));

    axios
      .post(`${db.serverUrl}/students/${studentDetails?.id}/courses`, courseIds)
      .then(() => {
        console.log("Successful");
        
        notifications.show({
          title: "Successful",
          message: `Student successfully enrolled in ${courseText}`,
          icon: <FaCheck />, // Adding the success icon
          color: "teal",
          position: "top-right",
        });
        setCourses([]); // Clear selected courses
      })
      .catch((error) => {
        notifications.show({
          title: `Failed to enrol ${courseText}`,
          message: error.response?.data?.message || "An error occurred",
          icon: <FaTimes />, // Adding the error icon
          color: "red",
          position: "top-right",
        });
      })
      .finally(() => {
        setIsSubmitting(false); // Reset loading state
        close()
      });
  };

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
            {studentDetails?.Courses.map(
              ({ courseName, credit, courseCode }) => (
                <Table.Tr key={courseCode}>
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
      <Modal
        opened={opened}
        onClose={close}
        title="Enrol Student to course"
        size="lg"
        padding={30}
      >
        <form onSubmit={handleSubmit}>
          <MultiSelect
            data={courseOptions}
            value={courses}
            placeholder="Select courses"
            searchable
            onChange={setCourses}
          />
          <Button
            type="submit"
            mt={10}
            radius={20}
            color="#15803d"
            loading={isSubmitting} // Disable button and show loading state
          >
            Submit
          </Button>
        </form>
      </Modal>
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
    console.error("Error fetching students:", err);
    return null;
  }
};
