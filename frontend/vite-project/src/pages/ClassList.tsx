import { Button, Grid, Paper, Modal } from "@mantine/core";
import { Link } from "react-router-dom";
import { Class, ClassInfo } from "../sharedTypes";
import { useDisclosure } from "@mantine/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateClassMutation, useGetClassesQuery } from "../api/classApi";
import { useEffect, useState } from "react";
import { displayNotification } from "../components/notifications";
import ClassForm from "../components/ClassForm";
import { SlGraduation } from "react-icons/sl";
import { GoPerson } from "react-icons/go";

interface ClassListCardProps {
  className: string;
  numberOfStudents: number;
  id: number;
}

function ClassListCard({
  className,
  numberOfStudents,
  id,
}: ClassListCardProps) {
  return (
    <Paper w={300} h={130} p={15} className="border border-gray-400">
      <Link to={`/classes/${id}`}>
        <div className="flex justify-between items-center">
          <div>
            <h5 className="secondary-color">{className}</h5>
            <div className="flex items-center gap-2 mt-2 mr-10">
              <GoPerson />
              <h6 className="text-sm">{numberOfStudents} students</h6>
            </div>
          </div>
          <SlGraduation fontSize={25} />
        </div>
      </Link>
    </Paper>
  );
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const formMethods = useForm<ClassInfo>();
  const { reset } = formMethods;
  const [createClass] = useCreateClassMutation();
  const { data, isLoading, isSuccess, isError, error } = useGetClassesQuery();

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data.items);

      setClasses(data.items);
    }
    if (isError) {
      let errorMessage;
      if ("data" in error) {
        const errorData: any = error.data;
        errorMessage =
          errorData.message ||
          "Error occured while fetching classes. Try again";
      }
      displayNotification({
        title: "Failed to fetch classes",
        message: errorMessage,
        type: "error",
      });
    }
  }, [isSuccess, data, isError, error]);

  const onSubmit = async (data: ClassInfo) => {
    const classFormData = {
      ...data,
      studentIds: data.studentIds.map((id) => parseInt(id)),
    };

    createClass(classFormData)
      .unwrap()
      .then((newClass: Class) => {
        setClasses((prevClasses) => [...prevClasses, newClass]);
        displayNotification({
          title: "Success",
          message: "Class created successfully!",
          type: "success",
        });
        reset();
      })
      .catch((error) =>
        displayNotification({
          title: "Failed to create class",
          message: error?.data?.message || "An error occurred",
          type: "error",
        })
      )
      .finally(() => close());
  };

  return (
    <>
      <div className="flex justify-between align-middle m-6 ml-0">
        <h3>Classes</h3>
        <Button color="#15803d" onClick={open}>
          Create New Class
        </Button>
      </div>
      <Grid gutter="lg">
        {classes?.map(({ id, className, Students }, index) => (
          <Grid.Col key={index} span={{ xs: 12, md: 4, lg: 2.4 }}>
            <ClassListCard
              className={className}
              numberOfStudents={Students?.length || 0}
              id={id}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Modal opened={opened} onClose={close} title="Create New Class">
        <FormProvider {...formMethods}>
          <ClassForm onSubmit={onSubmit} />
        </FormProvider>
      </Modal>
    </>
  );
}
