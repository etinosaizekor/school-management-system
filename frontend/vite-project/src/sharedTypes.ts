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
  courseName: string;
  students: Student[];
  courseCode: string,
  credit: number
}

export interface Student {
  firstName: string;
  lastName: string;
  age: number;
  Courses: Course[];
  class: Class;
}

export interface Class {
  className: string;
  students: Student;
}


