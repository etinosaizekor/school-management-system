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
  courseName: string
  students: Student[]
}

export interface Student {
  firstName: string;
  lastName: string;
  age: number, 
  courses: Course[]
  class: Class;
}

export interface Class {
  className: string;
  students: Student;
}
