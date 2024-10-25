import { Button, MultiSelect } from "@mantine/core";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import CustomModal from "./CustomModal";
import { FormProvider, useForm } from "react-hook-form";
import { Student, StudentInfo } from "../sharedTypes";
import StudentFormModal from "./StudentForm";
import {
  useCreateStudentMutation,
  useGetStudentsQuery,
} from "../api/studentApi";
import { displayNotification } from "./notifications";

interface StudentEnrollmentFormProps {
  isOpened: boolean;
  onClose: () => void;
  isEnrolling: boolean;
  onEnrollmentSubmission: (data: string[]) => void;
  initialData?: string[];
}

function StudentEnrollmentForm({
  isEnrolling,
  isOpened,
  onClose,
  onEnrollmentSubmission,
  initialData = [],
}: StudentEnrollmentFormProps) {
  const [studentList, setStudentList] = useState<
    { value: string; label: string }[]
  >([]);

  const [studentsToEnroll, setStudentsToEnroll] =
    useState<string[]>(initialData);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);

  const studentFormMethods = useForm<StudentInfo>({});
  const { reset: resetStudentForm, setValue } = studentFormMethods;

  const [createStudent] = useCreateStudentMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEnrollmentSubmission(studentsToEnroll);
  };

  useEffect(() => {
    setStudentsToEnroll(initialData);
  }, [initialData]);

  const handleStudentSubmission = async (data: StudentInfo) => {
    const { courseIds, classId } = data;
    const studentFormData = {
      ...data,
      courseIds: courseIds
        ? courseIds.map((courseId) => parseInt(courseId))
        : [],
      classId: parseInt(classId),
    };

    createStudent(studentFormData)
      .unwrap()
      .then((newStudent) => {
        setStudentsInClass([...studentsInClass, newStudent]);
        const { id, firstName, lastName } = newStudent;
        setStudentList([
          ...studentList,
          {
            value: newStudent?.id.toString(),
            label: `${firstName} ${lastName}`,
          },
        ]);
        setStudentsToEnroll([...studentsToEnroll, id.toString()]);

        setIsStudentFormOpen(false);
        displayNotification({
          title: "Success",
          message: "Student created successfully!",
          type: "success",
        });
        resetStudentForm();
      })
      .catch((error) =>
        displayNotification({
          title: "Error",
          message: error?.data?.message || "An error occurred",
          type: "error",
        })
      )
      .finally(() => close());
  };

  const { data, isLoading, isSuccess } = useGetStudentsQuery();

  useEffect(() => {
    if (data && studentsInClass) {
      const enrolledStudentIds = new Set(studentsInClass?.map((s) => s.id));

      setStudentList(
        data?.items?.map((studentInList) => ({
          value: studentInList?.id.toString(),
          label: `${studentInList?.firstName} ${studentInList?.lastName}`,
          disabled: enrolledStudentIds.has(studentInList?.id),
        })) || []
      );
    } else {
      setStudentList([]);
    }
  }, [data, studentsInClass]);

  return (
    <>
      {isStudentFormOpen ? (
        <FormProvider {...studentFormMethods}>
          <StudentFormModal
            isOpen={isStudentFormOpen}
            close={() => setIsStudentFormOpen(false)}
            onSubmit={handleStudentSubmission}
            isSubmitting={false}
            includeBackButton={true}
            onBackButtonClick={() => {
              setIsStudentFormOpen(false);
            }}
          />
        </FormProvider>
      ) : (
        <CustomModal
          opened={isOpened}
          onClose={onClose}
          title="Enrol Student to Course"
          size="lg"
          withBackButton={false}
        >
          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <MultiSelect
                data={studentList}
                value={studentsToEnroll}
                placeholder="Select Students"
                searchable
                onChange={setStudentsToEnroll}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="subtle"
                  color="#15803d"
                  p={5}
                  onClick={() => setIsStudentFormOpen(true)}
                  rightSection={<IoAdd color="#15803d" size={20} />}
                >
                  Create Student
                </Button>
              </div>
              <Button
                type="submit"
                mt={10}
                radius={20}
                color="#15803d"
                loading={isEnrolling}
              >
                Submit
              </Button>
            </form>
          </div>
        </CustomModal>
      )}
    </>
  );
}

export default StudentEnrollmentForm;
