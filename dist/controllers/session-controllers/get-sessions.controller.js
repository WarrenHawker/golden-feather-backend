"use strict";
/*
  "get sessions" controller function

  Gets all the active user sessions.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessions = void 0;
const logger_service_1 = require("../../services/logger.service");
const getSessions = async (req, res) => {
    //check session store exists
    if (!req.sessionStore) {
        const error = {
            code: 404,
            message: 'Session store not found.',
        };
        res.status(404).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //get all active user sessions
    req.sessionStore.all((err, sessions) => {
        if (err) {
            const error = {
                code: 500,
                message: err.message,
            };
            res.json(error);
            (0, logger_service_1.createLog)('critical', req, res, error);
            return;
        }
        if (!sessions?.length) {
            const error = {
                code: 404,
                message: 'No sessions found.',
            };
            res.status(404).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        res.status(200).json(sessions);
    });
};
exports.getSessions = getSessions;
