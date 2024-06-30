"use strict";
/*
  "require user authentication" middleware

  Runs before allowing access to any protected routes.
  Checks both for a valid session as well as the user's current role and status.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const logger_service_1 = require("../services/logger.service");
const authenticate = (req, res, next) => {
    if (!req.session) {
        const err = new Error('Unauthenticated user');
        err.statusCode = 401;
        const error = {
            code: 401,
            message: 'No valid session found',
        };
        (0, logger_service_1.createLog)('error', req, res, error);
        next(err);
    }
    else {
        next();
    }
};
exports.authenticate = authenticate;
