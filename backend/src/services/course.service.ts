import { BaseService } from "./baseService";
import db from "../database/models";
import { Course } from "../database/models/course";
import { CreationAttributes, Model, ModelStatic, Op } from "sequelize";
import { PageOptions, PaginatedResult } from "../sharedTypes";
import ApiError from "../helper/ApiError";
import { getCourses } from "../controllers/course.controller";
import { Class } from "../database/models/class";
import { Student } from "../database/models/student";

class CourseService extends BaseService<Course> {
  constructor(model: ModelStatic<Course>) {
    super(model);
  }

  async create(courseData: CreationAttributes<Course>): Promise<Course> {
    const { studentIds } = courseData;
    const course = await this.model.create(courseData);

    await course.addStudents(studentIds, { raw: true });
    return course;
  }

  async addStudents(
    courseId: string,
    studentIds: number[]
  ): Promise<Student[]> {
    const course = await this.model.findByPk(courseId);

    if (!course) {
      throw new ApiError(404, `Course with ID ${courseId} not found`);
    }

    const students = await Student.findAll({
      where: {
        id: studentIds,
      },
      raw: true,
    });

    const courseStudentIds = students.map((student) => student.id);
    await course.addStudents(courseStudentIds);

    const courseStudents = await course.getStudents();
    return courseStudents;
  }

  async removeStudents(
    courseId: string,
    courseIds: string[]
  ): Promise<Student[]> {
    // Fetch the course
    const course = await this.model.findByPk(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    course.removeStudents(courseIds);
    const updatedCourses = await course.getStudents();

    return updatedCourses;
  }

  async findById(courseId: string): Promise<Course | null> {
    const course = await this.model.findByPk(courseId, {
      include: [
        {
          model: Student,
        },
      ],
    });

    return course;
  }

  async find(
    criteria: Record<string, any> = {},
    options: PageOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult | null> {
    const { page, limit } = options;

    const startIndex = (page - 1) * limit;

    try {
      const results = await this.model.findAll({
        where: criteria,
        include: [
          {
            model: Student,
          },
        ],
        offset: startIndex,
        limit: limit,
      });

      const totalDocumentCount = await this.model.count(criteria);
      const totalPages = Math.ceil(totalDocumentCount / limit);

      return {
        items: results,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalDocumentCount,
          limit,
        },
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }
  async update(
    courseId: number | string,
    updatedData: Record<string, any>
  ): Promise<Course | null> {
    const existingCourse = await this.model.findOne({
      where: {
        courseCode: updatedData.courseCode,
        id: { [Op.ne]: courseId },
      },
    });

    if (existingCourse) {
      throw new Error("A course with this course code already exists.");
    }

    await this.model.update(updatedData, {
      where: { id: courseId },
    });

    const foundCourse = await this.model.findByPk(courseId);

    if (foundCourse && updatedData.studentIds) {
      await foundCourse.setStudents(updatedData.studentIds);
    }

    const updatedCourse = await this.model.findByPk(courseId, {
      include: Student,
    });

    return updatedCourse;
  }
}

export const courseService = new CourseService(db.course);
