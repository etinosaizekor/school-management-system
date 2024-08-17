import { Grid, Paper } from "@mantine/core";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import { IFindResult } from "../types";
import db from "../db";

// interface IStudent {
//   name: string;
//   lastName: string;
// }

interface ClassListCardProps {
  className: string;
  numberOfStudent: number;
}

function ClassListCard({
  className,
  numberOfStudent,
}: ClassListCardProps) {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <Link to="#">
        <div className="flex flex-col justify-center h-full gap-1">
          <h5 className="secondary-color">{className}</h5>
          <h6> {numberOfStudent} students</h6>
        </div>
      </Link>
    </Paper>
  );
}

export default function Classes() {
  const classes = useLoaderData() as IFindResult;
  console.log(classes);
  let numberOfStudent = 1;

  return (
    <Grid grow>
      {classes?.items?.map(({ className, students }, index) => (
        <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2 }}>
          <ClassListCard
            className={className}
            numberOfStudent={numberOfStudent + 1}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export const fetchClasses = async () => {
  const serverUrl = db.serverUrl;
  console.log("Server URL:", serverUrl);
  try {
    const response = await axios.get(`${serverUrl}/classes`);
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Error fetching classes:", err);
    return null
  }
};
