export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  Courses: Course[];
  Class: Class;
}

export interface FindQueryResult {
  items: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    limit: number;
  };
}

export interface Course {
  id: number;
  courseName: string;
  Students: Student[];
  courseCode: string;
  credit: number;
}

export interface Class {
  id: number;
  className: string;
  Students: Student[];
}

export interface FormProps {
  mode?: "creation" | "edit";
  onSubmit: (data: any) => void;
  errorMessage?: string;
}

export type StudentInfo = Omit<Student, "Courses" | "Class"> & {
  courseIds: string[];
  classId: string;
};
export type ClassInfo = Omit<Class, "Students"> & {
  studentIds: string[];
};

export type CourseInfo = Omit<Course, "Students"> & {
  studentIds: string[];
};

export interface labelValuePair {
  label: string;
  value: any;
}
