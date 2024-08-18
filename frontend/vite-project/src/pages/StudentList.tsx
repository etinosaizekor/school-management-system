import { Grid, Paper } from "@mantine/core";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import { FindQueryResult } from "../sharedTypes";
// import db from "../db";

interface StudentListCardProps {
  id: string;
  firstName: string;
  classId: string;
  numberOfCoursesEnrolled: number;
}

function StudentListCard({
  id,
  firstName,
  numberOfCoursesEnrolled,
}: StudentListCardProps) {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <Link to={`/students/${id}`}>
        <div className="flex flex-col justify-center h-full gap-1">
          <h5 className="secondary-color">{firstName}</h5>
          <h6> {numberOfCoursesEnrolled} Courses</h6>
        </div>
      </Link>
    </Paper>
  );
}

export default function StudentList() {
  const students = useLoaderData() as FindQueryResult;
  console.log(students);
  let numberOfCoursesEnrolled = 1;

  return (
    <Grid grow>
      {students?.items?.map(({ id, firstName, students }, index) => (
        <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2 }}>
          <StudentListCard
            id={id}
            firstName={firstName}
            numberOfCoursesEnrolled={numberOfCoursesEnrolled + 1}
            classId="12"
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}

// export const fetchStudents = async () => {
//   const serverUrl = db.serverUrl;
//   console.log("Server URL:", serverUrl);
//   try {
//     const response = await axios.get(`${serverUrl}/students`);
//     console.log(response);

//     return response.data;
//   } catch (err) {
//     console.error("Error fetching students:", err);
//     return null;
//   }
// };
