import { Request, Response } from "express";
import { courseService } from "../services/course.service";
import asyncHandler from "express-async-handler";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const userId = req.userId;

    const newCourse = await courseService.create({ ...body, userId });
    res.status(201).json(newCourse);
  }
);

export const addStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = req.body;

  const { courseId } = req.params;

  const studentCourses = await courseService.addStudents(courseId, students);
  res.send(studentCourses);
});

export const removeStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const students = req.body;
    const { courseId } = req.params;

    const studentCourses = await courseService.removeStudents(
      courseId,
      students
    );

    res.send(studentCourses);
  }
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const courses = await courseService.find({ userId });
  res.status(200).json(courses);
});

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseService.findById(id);
    res.status(200).json(course);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    const updatedCourse = await courseService.update(id, body);
    res.status(200).json(updatedCourse);
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const deletedCourse = await courseService.deleteOne(id);
    res.status(200).json(deletedCourse);
  }
);
