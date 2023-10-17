"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressValidatorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
function ExpressValidatorMiddleware(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log({
            'message': 'Your body was bad formatted',
            ...errors,
        });
        return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({ 'message': 'Your body was bad formatted',
            'errors': { ...errors }.errors,
        });
    }
    next();
}
exports.ExpressValidatorMiddleware = ExpressValidatorMiddleware;
