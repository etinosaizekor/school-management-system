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
}

export interface Student {
  firstName: string;
  lastName: string;
  class: Class;
}

export interface Class {
  className: string;
  students: Student;
}