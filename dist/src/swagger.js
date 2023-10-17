"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
(0, dotenv_1.config)();
console.log(process.env.BASE_API_URL);
const doc = {
    info: {
        version: '',
        title: 'Canal Olympia Scrapping REST API',
        description: '', // by default: ''
    },
    basePath: '/',
    schemes: [],
    consumes: [],
    produces: [],
    securityDefinitions: {},
    definitions: {},
    components: {}
}; // update doc
const outputFile = './docs/swagger-output.json';
const endpointsFiles = [
    path_1.default.join(__dirname, 'app.ts'),
];
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, {
    ...doc,
    host: process.env.BASE_API_URL
});
