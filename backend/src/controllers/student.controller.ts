import { Request, Response } from "express";
import { studentService } from "../services/student.service";
import asyncHandler from "../utils/asyncHandler";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseIds, classId } = req.body;

    const newStudent = await studentService.create(req.body);

    res.status(201).json(newStudent);
  }
);

export const addCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = req.body;

  const { studentId } = req.params;

  const studentCourses = await studentService.addCourses(studentId, courses);

  res.send(studentCourses);
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  delay(10000);
  const students = await studentService.find();
  res.status(200).json(students);
});

export const getStudentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentService.findById(id);
    res.status(200).json(student);
  }
);

export const updateStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const updatedStudent = await studentService.update(id, body);
    res.status(200).json(updatedStudent);
  }
);

export const deleteStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const deletedStudent = await studentService.deleteOne(id);
    res.status(200).json(deletedStudent);
  }
);

export const removeCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = req.body;
    const { studentId } = req.params;

    const studentCourses = await studentService.removeCourses(
      studentId,
      courses
    );

    res.send(studentCourses);
  }
);
