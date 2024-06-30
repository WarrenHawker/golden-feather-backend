"use strict";
/*
  "delete session" controller function

  Deletes an existing session from the database by the sessionId property.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = void 0;
const logger_service_1 = require("../../services/logger.service");
const deleteSession = async (req, res) => {
    //grab session id from URL
    const sessionId = req.params.id;
    //check all params exist
    const missingParams = [];
    if (!sessionId) {
        missingParams.push('userId');
    }
    if (missingParams.length > 0) {
        const error = {
            code: 400,
            message: 'Missing url parameters',
            params: missingParams,
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //checks the session storage exists
    if (!req.sessionStore) {
        const error = {
            code: 404,
            message: 'Session store not found.',
        };
        res.status(404).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //deletes the selected session
    req.sessionStore.destroy(sessionId, (err) => {
        res.sendStatus(200);
        (0, logger_service_1.createLog)('info', req, res);
    });
};
exports.deleteSession = deleteSession;
