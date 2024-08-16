import { Paper } from "@mantine/core";
function ClassDetailsCard() {
  return (
    <Paper w={300} h={130} p={10} className="border border-gray-400">
      <div className="flex flex-col justify-center h-full gap-1">
        <h5 className="secondary-color">
          Object Oriented Programming
        </h5>
        <h6>6 students</h6>
      </div>
    </Paper>
  );
}

export default function Classes() {
  return (
    <div>
      <ClassDetailsCard />
    </div>
  );
}
