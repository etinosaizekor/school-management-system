import { Grid, Paper } from "@mantine/core";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import { FindQueryResult } from "../sharedTypes";
import db from "../db";

interface CourseListCardProps {
  courseName: string;
  numberOfStudent: number;
}

function CourseListCard({ courseName, numberOfStudent }: CourseListCardProps) {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <Link to="#">
        <div className="flex flex-col justify-center h-full gap-1">
          <h5 className="secondary-color">{courseName}</h5>
          <h6> {numberOfStudent} students</h6>
        </div>
      </Link>
    </Paper>
  );
}

export default function CourseList() {
  const courses = useLoaderData() as FindQueryResult;
  console.log(courses);
  let numberOfStudent = 1;

  return (
    <Grid grow>
      {courses?.items?.map(({ courseName, students }, index) => (
        <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2 }}>
          <CourseListCard
            courseName={courseName}
            numberOfStudent={numberOfStudent + 1}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export const fetchCourses = async () => {
  const serverUrl = db.serverUrl;
  console.log("Server URL:", serverUrl);
  try {
    const response = await axios.get(`${serverUrl}/courses`);
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    return null;
  }
};
