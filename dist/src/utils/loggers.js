"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapLogger = exports.getLogger = void 0;
const path_1 = __importDefault(require("path"));
const log4js_1 = __importDefault(require("log4js"));
const log4js_2 = require("log4js");
var log4js_3 = require("log4js");
Object.defineProperty(exports, "getLogger", { enumerable: true, get: function () { return log4js_3.getLogger; } });
function bootstrapLogger() {
    const date = new Date();
    const strDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    (0, log4js_2.configure)({
        appenders: {
            out: { type: 'stdout' },
            app: { type: 'file', filename: path_1.default.join(__dirname, '..', 'logs', `${strDate}.log`) }
        },
        categories: {
            default: { appenders: ['out', 'app'], level: 'debug' }
        }
    });
    const logger = log4js_1.default.getLogger();
    logger.level = 'debug';
}
exports.bootstrapLogger = bootstrapLogger;
