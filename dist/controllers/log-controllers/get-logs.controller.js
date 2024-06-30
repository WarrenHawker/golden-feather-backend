"use strict";
/*
  "get logs" controller function

  Gets all logs from the database that match the search criteria.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const log_model_mongoose_1 = require("../../lib/mongoose/log-model.mongoose");
const validator_1 = __importDefault(require("validator"));
const validate_input_function_1 = require("../../utils/functions/validate-input.function");
const logger_service_1 = require("../../services/logger.service");
const { isEmpty, isDate, escape } = validator_1.default;
const getLogs = async (req, res) => {
    //get search params from url
    let { level, before, after, code, page, limit } = req.query;
    //object used to store sanitised search params
    const searchData = {};
    /*
      validate and sanitise search params.
      If param passes all tests it goes into the searchData object
    */
    if (level) {
        if (!(0, validate_input_function_1.isLogLevel)(level)) {
            const error = {
                code: 400,
                message: 'Invalid "level" search parameter.',
                params: ['level'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            level = escape(level).trim();
            if (!isEmpty(level, { ignore_whitespace: true })) {
                searchData.level = level;
            }
        }
    }
    if (before) {
        if (!isDate(before)) {
            const error = {
                code: 400,
                message: 'Invalid "before" search parameter.',
                params: ['before'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            before = escape(before).trim();
            if (!isEmpty(before, { ignore_whitespace: true })) {
                if (searchData.timestamp) {
                    searchData.timestamp.$lte = new Date(before);
                }
                else {
                    searchData.timestamp = { $lte: new Date(before) };
                }
            }
        }
    }
    if (after) {
        if (!isDate(after)) {
            const error = {
                code: 400,
                message: 'Invalid "after" search parameter.',
                params: ['after'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            after = escape(after).trim();
            if (!isEmpty(after, { ignore_whitespace: true })) {
                if (searchData.timestamp) {
                    searchData.timestamp.$gte = new Date(after);
                }
                else {
                    searchData.timestamp = { $gte: new Date(after) };
                }
            }
        }
    }
    if (code) {
        if (!(0, validate_input_function_1.isResCode)(code)) {
            const error = {
                code: 400,
                message: 'Invalid "code" search parameter.',
                params: ['code'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            code = escape(code).trim();
            if (!isEmpty(code, { ignore_whitespace: true })) {
                searchData.responseCode = code;
            }
        }
    }
    //validate and set the correct page number for page pagination
    let pageNum = 1;
    if (page) {
        if (!(0, validate_input_function_1.isNumber)(page)) {
            const error = {
                code: 400,
                message: 'Invalid "page" search parameter.',
                params: ['page'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            pageNum = parseInt(escape(page).trim());
        }
    }
    //validate and set the correct limit for page pagination
    let limitNum = 10;
    if (limit) {
        if (!(0, validate_input_function_1.isNumber)(limit)) {
            const error = {
                code: 400,
                message: 'Invalid "limit" search parameter.',
                params: ['limit'],
            };
            res.status(400).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
        else {
            if (parseInt(escape(limit).trim()) > 10) {
                limitNum = 10;
            }
            else {
                limitNum = parseInt(escape(limit).trim());
            }
        }
    }
    //fetch logs from database
    try {
        const options = {
            page: pageNum,
            limit: limitNum,
        };
        /*
          Query uses mongoose-paginate-v2 plugin.
          For more details see https://www.npmjs.com/package/mongoose-paginate-v2
         */
        const logs = await log_model_mongoose_1.Log.paginate(searchData, options);
        const result = {
            currentPage: pageNum,
            totalPages: logs.totalPages,
            numberOfResults: logs.docs.length,
            totalNumberOfResults: logs.totalDocs,
            logs: logs.docs,
        };
        res.status(200).json(result);
        return;
    }
    catch (err) {
        const error = {
            code: 500,
            message: err.message,
        };
        (0, logger_service_1.createLog)('critical', req, res, error);
        return;
    }
};
exports.getLogs = getLogs;
