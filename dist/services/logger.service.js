"use strict";
/*
  "automated logging" service

  Creates a log and stores it in MongoDB database.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = void 0;
const log_model_mongoose_1 = require("../lib/mongoose/log-model.mongoose");
const createLog = async (level, req, res, error) => {
    //if there's an error, use the error message. Else, use generic success message
    let logMessage;
    if (res.statusCode == 200 || res.statusCode == 201) {
        logMessage = `${req.method} request to ${req.originalUrl} successful.`;
    }
    else {
        logMessage = `ERROR: ${error?.message}`;
    }
    const data = {
        level: level,
        message: logMessage,
        timestamp: new Date(),
        responseCode: res.statusCode,
        request: {
            body: req.body,
            headers: req.headers,
            url: req.originalUrl,
            method: req.method,
            ip: req.socket.remoteAddress,
        },
    };
    const log = await log_model_mongoose_1.Log.create(data);
    //TODO if log is critical, email admins
    return log;
};
exports.createLog = createLog;
