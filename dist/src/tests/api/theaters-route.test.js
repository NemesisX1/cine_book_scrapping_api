"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
(0, globals_1.describe)('Testing theaters routes', () => {
    (0, globals_1.test)('if /GET is working', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/');
        (0, globals_1.expect)(res.statusCode).toBe(200);
    });
});
