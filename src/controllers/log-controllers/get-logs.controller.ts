/**
 * @file get-logs.controller.ts
 * @description Controller for handling the retrieval of logs from the database, sorted by month.
 *              Logs are stored in collections based on the month they were generated. This controller
 *              allows clients to fetch logs from a specific month using the "month" query parameter in
 *              the format "YYYY_MM". If the "month" parameter is not provided, the controller defaults
 *              to retrieving logs from the current month. It also supports pagination through "page"
 *              and "limit" query parameters.
 *
 * @module controllers/logs
 *
 * @function getLogs - Express middleware function to handle GET requests for retrieving logs from the
 *                     database based on optional query parameters like page, limit, and month.
 *
 * @param {Request} req - The Express request object, which may contain query parameters for page, limit,
 *                        and month to filter the logs.
 * @param {Response} res - The Express response object used to send the JSON response.
 *
 * @returns {Promise<Response>} - A promise that resolves with an HTTP response containing either the
 *                                requested logs data or an error message.
 *
 * @throws {Error} - Throws a 400 error for invalid input parameters, a 404 error if no logs are found,
 *                   and a 500 error for any issues during the log retrieval process.
 *
 * @requires ../../lib/mongoose/log-model.mongoose - Utility to retrieve the log model for the specified month.
 * @requires ../../types/log - Type definition for search data used in log queries.
 * @requires ../../services/logger.service - Service to log errors and critical messages.
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires validator - Library used to sanitize input strings.
 * @requires moment - Library used to manage date and time formatting.
 * @requires ../../utils/functions/validate-input.function - Utility function to validate numerical input.
 */

import { Request, Response } from 'express';
import { getLogModelForMonth } from '../../lib/mongoose/log-model.mongoose';
import { LogSearchData } from '../../types/log';
import { escape } from 'validator';
import { isNumber } from '../../utils/functions/validate-input.function';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import moment from 'moment';

const getLogs = async (req: Request, res: Response) => {
  let { page, limit, month } = req.query;
  const searchData: LogSearchData = {};

  let pageNum: number = 1;
  if (page) {
    if (!isNumber(page as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "page" search parameter.',
        params: ['page'],
      };
      return res.status(400).json(error);
    } else {
      pageNum = parseInt(escape(page as string).trim());
    }
  }

  let limitNum: number = 10;
  if (limit) {
    if (!isNumber(limit as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "limit" search parameter.',
        params: ['limit'],
      };
      return res.status(400).json(error);
    } else {
      if (parseInt(escape(limit as string).trim()) > 10) {
        limitNum = 10;
      } else {
        limitNum = parseInt(escape(limit as string).trim());
      }
    }
  }

  let collectionName: string;
  if (month) {
    const monthString = escape(month as string).trim();
    const monthRegex = /^\d{4}_\d{2}$/; // Matches YYYY_MM format

    if (!monthRegex.test(monthString)) {
      const error: ErrorReturn = {
        code: 400,
        message:
          'Invalid "month" search parameter. Expected format is "YYYY_MM".',
        params: ['month'],
      };
      return res.status(400).json(error);
    } else {
      collectionName = `logs_${monthString}`;
    }
  } else {
    const now = moment();
    const year = now.format('YYYY');
    const month = now.format('MM');
    collectionName = `logs_${year}_${month}`;
  }

  try {
    const options = {
      page: pageNum,
      limit: limitNum,
    };

    /* 
      Query uses mongoose-paginate-v2 plugin. 
      For more details see https://www.npmjs.com/package/mongoose-paginate-v2
     */
    const collection = await getLogModelForMonth(collectionName);
    const logs = await collection.paginate(searchData, options);

    if (logs.docs.length == 0) {
      const error: ErrorReturn = {
        code: 404,
        message: 'no logs found',
      };
      return res.status(404).json(error);
    }

    const result = {
      currentPage: pageNum,
      totalPages: logs.totalPages,
      numberOfResults: logs.docs.length,
      totalNumberOfResults: logs.totalDocs,
      logs: logs.docs,
    };
    return res.status(200).json(result);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default getLogs;
