/**
 * @file create-log.service.ts
 * @description Service function for creating and storing logs in a MongoDB collection specific to the current month.
 *              The function logs requests and responses, including any errors, and categorizes logs by their severity level.
 *              Logs are stored in collections named by the year and month, and the log schema is used to structure the data.
 *              The function also includes a placeholder for sending email notifications to admins for critical logs.
 *
 * @module services/logging
 *
 * @function createLog - Asynchronous function to create and store a log entry based on the request and response data.
 *                       The log entry is saved in a MongoDB collection specific to the current month, named in the format `logs_YYYY_MM`.
 *
 * @param {LogLevel} level - The severity level of the log (e.g., 'info', 'error', 'critical').
 * @param {Request} req - The Express request object containing details of the HTTP request.
 * @param {Response} res - The Express response object containing details of the HTTP response.
 * @param {ErrorReturn} [error] - Optional error object containing error details if the log relates to an error.
 *
 * @returns {Promise<object>} - A promise that resolves with the saved log entry object.
 *
 * @throws {Error} - Throws an error if there is an issue saving the log entry to the database.
 *
 * @requires mongoose - Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
 * @requires moment - Moment.js is a library for parsing, validating, manipulating, and formatting dates.
 * @requires ../lib/mongoose/log-model.mongoose - The Mongoose log schema definition.
 * @requires ../types/error-return - Type definition for the structure of error responses.
 * @requires ../types/log - Type definitions for logging, including log levels, request methods, and response codes.
 * @requires express - Express.js framework, used here for request and response object types.
 */

import mongoose from 'mongoose';
import { logSchema } from '../lib/mongoose/log-model.mongoose';
import ErrorReturn from '../types/error-return';
import { LogData, LogLevel, ReqMethod, ResCode } from '../types/log';
import { Request, Response } from 'express';
import moment from 'moment';

const getLogModelForMonth = (year: string, month: string) => {
  const collectionName = `logs_${year}_${month}`;
  return mongoose.model(collectionName, logSchema, collectionName);
};

const createLog = async (
  level: LogLevel,
  req: Request,
  res: Response,
  error?: ErrorReturn
) => {
  //if there's an error, use the error message. Else, use generic success message
  let logMessage: string | undefined;
  if (res.statusCode == 200 || res.statusCode == 201) {
    logMessage = `${req.method} request to ${req.originalUrl} successful.`;
  } else {
    logMessage = `ERROR: ${error?.message}`;
  }

  const data: LogData = {
    level: level,
    message: logMessage,
    timestamp: new Date(),
    responseCode: res.statusCode as ResCode,
    request: {
      body: req.body,
      headers: req.headers,
      url: req.originalUrl,
      method: req.method as ReqMethod,
      ip: req.socket.remoteAddress,
    },
  };

  //place log in collection for the current month
  const now = moment();
  const year = now.format('YYYY');
  const month = now.format('MM');

  const Log = getLogModelForMonth(year, month);
  const logEntry = new Log(data);
  await logEntry.save();

  //TODO if log is critical, email admins
  return logEntry;
};

export default createLog;
