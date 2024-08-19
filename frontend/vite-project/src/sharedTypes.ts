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
  id: number,
  courseName: string;
  students: Student[];
  courseCode: string,
  credit: number
}

export interface Student {
  id: number
  firstName: string;
  lastName: string;
  age: number;
  Courses: Course[];
  classId: number;
}

export interface Class {
  className: string;
  students: Student;
}


