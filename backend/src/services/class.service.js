"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classService = void 0;
const baseService_1 = require("./baseService");
const models_1 = __importDefault(require("../database/models"));
exports.classService = new baseService_1.BaseService(models_1.default.class);
