import { useEffect, useState } from "react";
import CourseForm from "./CourseForm";
import { Button, Modal, MultiSelect } from "@mantine/core";
import { useCreateCourseMutation, useGetCoursesQuery } from "../api/courseApi";
import { Course, CourseInfo } from "../sharedTypes";
import { displayNotification } from "./notifications";
import { FormProvider, useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import CustomModal from "./CustomModal";

interface CourseEnrollmentFormProps {
  isOpen: boolean;
  close: () => void;
  onEnrollmentSubmission: (coursesToEnrol: string[]) => void;
  isEnrolling: boolean;
  initialData?: string[];
}

function CourseEnrollmentForm({
  isOpen,
  close,
  onEnrollmentSubmission,
  isEnrolling,
  initialData = [],
}: CourseEnrollmentFormProps) {
  const [isCourseCreationFormOpen, setIsCourseCreationFormOpen] =
    useState(false);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [coursesToEnrol, setCoursesToEnrol] = useState<string[]>([]);

  const [createCourse] = useCreateCourseMutation();
  const [coursecreationError, setCourseCreationError] = useState("");

  const formMethods = useForm<CourseInfo>();
  const { reset } = formMethods;

  const { data: coursesData } = useGetCoursesQuery();

  useEffect(() => {
    setCoursesToEnrol(initialData);
  }, [initialData]);

  useEffect(() => {
    if (coursesData) {
      const allCourses = coursesData?.items || [];

      const courseData = allCourses.map((course) => ({
        value: course.id.toString(),
        label: course.courseName,
        disabled: initialData?.includes(course.id.toString()),
      }));

      setCourseOptions(courseData);
    }
  }, [coursesData, initialData]);

  const handleNewCourseSubmission = async (data: CourseInfo) => {
    const { studentIds } = data;
    const studentFormData = {
      ...data,
      studentIds: studentIds
        ? studentIds?.map((studentId) => parseInt(studentId))
        : [],
    };

    createCourse(studentFormData)
      .unwrap()
      .then((newCourse) => {
        setCourseOptions([
          ...courseOptions,
          { value: newCourse.id.toString(), label: newCourse.courseName },
        ]);
        setCoursesToEnrol([...coursesToEnrol, newCourse.id.toString()]);

        displayNotification({
          title: "Success",
          message: "Course created successfully!",
          type: "success",
        });
        reset();
        setIsCourseCreationFormOpen(false);
      })
      .catch((error) => {
        const err = error?.data?.message;
        setCourseCreationError(err);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEnrollmentSubmission(coursesToEnrol);
  };

  return (
    <CustomModal
      opened={isOpen}
      onClose={close}
      title={
        isCourseCreationFormOpen
          ? "Create New Course"
          : "Enrol Student to courses"
      }
      size="lg"
      withBackButton={isCourseCreationFormOpen && true}
      onBackButtonClick={() => setIsCourseCreationFormOpen(false)}
    >
      {isCourseCreationFormOpen ? (
        <FormProvider {...formMethods}>
          <CourseForm
            onSubmit={handleNewCourseSubmission}
            errorMessage={coursecreationError}
          />
        </FormProvider>
      ) : (
        <form onSubmit={handleSubmit}>
          <MultiSelect
            data={courseOptions}
            value={coursesToEnrol}
            placeholder="Select courses"
            searchable
            onChange={setCoursesToEnrol}
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="subtle"
              color="#15803d"
              p={5}
              onClick={() => setIsCourseCreationFormOpen(true)}
              rightSection={<IoAdd color="#15803d" size={20} />}
            >
              Create Course
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
      )}
    </CustomModal>
  );
}

export default CourseEnrollmentForm;
