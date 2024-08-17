import { Grid, Paper } from "@mantine/core";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { IFindResult } from "../types";

interface IStudent {
  name: string;
  lastName: string;
}

interface ClassDetailsCardProps {
  className: string;
  numberOfStudent: number;
}

function ClassDetailsCard({
  className,
  numberOfStudent,
}: ClassDetailsCardProps) {
  return (
    <Paper w={280} h={130} p={10} className="border border-gray-400">
      <div className="flex flex-col justify-center h-full gap-1">
        <h5 className="secondary-color">{className}</h5>
        <h6> {numberOfStudent} students</h6>
      </div>
    </Paper>
  );
}

export default function Classes() {
  const classes = useLoaderData() as IFindResult;
  console.log(classes);
  let numberOfStudent = 1;

  return (
    <Grid>
      {classes.items.map(({ className, students }, index) => (
        <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2 }}>
          <ClassDetailsCard
            className={className}
            numberOfStudent={numberOfStudent + 1}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export const fetchClasses = async (): Promise<IFindResult> => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  console.log("Server URL:", serverUrl);
  try {
    const response = await axios.get(`http://localhost:5000/api/classes`); // Hardcoded URL for testing
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Error fetching classes:", err);
    throw err;
  }
};
