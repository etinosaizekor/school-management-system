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
  students: Student[];
  courseCode: string;
  credit: number;
}

export interface Class {
  id: number
  className: string;
  students: Student;
}

export type StudentInfo = Omit<Student, "Courses" | "Class"> & {
  courseIds: string[];
  classId: string;
};
