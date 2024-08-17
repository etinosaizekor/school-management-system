import { Model, FindOptions, ModelStatic, CreationAttributes } from "sequelize";

export class BaseService<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(
    input: CreationAttributes<T> | CreationAttributes<T>[]
  ): Promise<T | T[]> {
    if (Array.isArray(input)) {
      // Use bulkCreate for an array of records
      const data = await this.model.bulkCreate(
        input as CreationAttributes<T>[]
      );
      return data;
    } else {
      // Use create for a single record
      const data = await this.model.create(input as CreationAttributes<T>);
      return data;
    }
  }

  async find(
    criteria: Record<string, any> = {},
    pagination: {
      page?: number;
      limit?: number;
      searchColumns?: string[];
      searchKeyword?: string;
    } = {}
  ): Promise<{
    items: T[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalItems: number;
      limit: number;
    };
  }> {
    const { page = 1, limit = 15 } = pagination;

    try {
      const startIndex = (page - 1) * limit;

      const results = await this.model.findAll({
        where: criteria,
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
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.model.findByPk(id);
    return data;
  }

  async deleteOne(id: number | string): Promise<number> {
    const result = await this.model.destroy({ where: { id: id as any } });
    return result;
  }

  async deleteMany(criteria: FindOptions): Promise<number> {
    const data = await this.model.destroy(criteria);
    return data;
  }

  async update(id: number | string, criteria: Partial<T>): Promise<number> {
    const [affectedCount] = await this.model.update(criteria, {
      where: { id: id as any },
    });
    return affectedCount;
  }
}
