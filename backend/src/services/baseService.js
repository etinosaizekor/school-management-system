"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(model) {
        this.model = model;
    }
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(input)) {
                // Use bulkCreate for an array of records
                const data = yield this.model.bulkCreate(input);
                return data;
            }
            else {
                // Use create for a single record
                const data = yield this.model.create(input);
                return data;
            }
        });
    }
    find() {
        return __awaiter(this, arguments, void 0, function* (criteria = {}, pagination = {}) {
            const { page = 1, limit = 15 } = pagination;
            try {
                const startIndex = (page - 1) * limit;
                const results = yield this.model.findAll({
                    where: criteria,
                    offset: startIndex,
                    limit: limit,
                });
                const totalDocumentCount = yield this.model.count(criteria);
                const totalPages = Math.ceil(totalDocumentCount / limit);
                return {
                    items: results,
                    totalPages,
                    currentPage: page,
                    totalItems: totalDocumentCount,
                    limit,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.findByPk(id);
            return data;
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.destroy({ where: { id: id } });
            return result;
        });
    }
    deleteMany(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.destroy(criteria);
            return data;
        });
    }
    update(id, criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            const [affectedCount] = yield this.model.update(criteria, {
                where: { id: id },
            });
            return affectedCount;
        });
    }
}
exports.BaseService = BaseService;
