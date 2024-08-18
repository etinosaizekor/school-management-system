import { BaseService } from "./baseService";
import db from "../database/models";
import { Student } from "../database/models/student";
import { CreationAttributes, Model, ModelStatic } from "sequelize";
import { PageOptions, PaginatedResult } from "../sharedTypes";
import { Course } from "../database/models/course";
import ApiError from "../helper/ApiError";

class StudentService extends BaseService<Student> {
  constructor(model: ModelStatic<Student>) {
    super(model);
  }

  async create(
    studentData: CreationAttributes<Student>,
    courseIds?: number[]
  ): Promise<Student> {
    const { courses } = studentData;
    const student = await this.model.create(studentData);

    if (courses && courses.length > 0) {
      await student.addCourses(courses);
    }

    return student;
  }

  async addCourses(studentId: string, courseIds: number[]): Promise<Course[]> {
    // Find the student by ID
    const student = await this.model.findByPk(studentId);

    if (!student) {
      throw new ApiError(404, `Student with ID ${studentId} not found`);
    }

    const courses = await Course.findAll({
      where: {
        id: courseIds,
      },
    });

    const studentCourseIds = courses.map((course) => course.id);
    await student.addCourses(studentCourseIds);

    const studentCourses = await student?.getCourses({ raw: true, });

    return studentCourses;
  }

  async findById(studentId: string): Promise<Student | null> {
    const student = await this.model.findByPk(studentId, {
      include: [
        {
          model: Course,
          attributes: ["id", "courseName"],
          through: { attributes: [] },
        },
      ],
    });

    return student;
  }

  async find(
    criteria: Record<string, any> = {},
    options: PageOptions = { page: 1, limit: 15 }
  ): Promise<PaginatedResult | null> {
    const { page, limit } = options;

    const startIndex = (page - 1) * limit;
    console.log(startIndex);

    try {
      const results = await this.model.findAll({
        where: criteria,
        include: [
          {
            model: Course,
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
}

export const studentService = new StudentService(db.student);
