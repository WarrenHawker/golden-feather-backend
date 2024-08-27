/*
  "get logs" controller function

  Logs are sorted into collections by month. To get logs from a specific month, use the 
  "month" query param. This param needs to be in the format "YYYY_MM", for example:

  http://localhost:5000/api/v1/log?month=2024_08

  will get all the logs from the August 2024 collection. If no month is specified, it defaults
  to getting the logs from the current month.
*/

//import packages
import { Request, Response } from 'express';
import { getLogModelForMonth } from '../../lib/mongoose/log-model.mongoose';
import { LogSearchData } from '../../types/log';
import validator from 'validator';
import { isNumber } from '../../utils/functions/validate-input.function';
import { createLog } from '../../services/logger.service';
import { ErrorReturn } from '../../types/error-return';
import moment from 'moment';

const { escape } = validator;

export const getLogs = async (req: Request, res: Response) => {
  let { page, limit, month } = req.query;
  const searchData: LogSearchData = {};

  //validate and set the correct page number for page pagination
  let pageNum: number = 1;
  if (page) {
    if (!isNumber(page as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "page" search parameter.',
        params: ['page'],
      };
      res.status(400).json(error);
      createLog('error', req, res, error);
      return;
    } else {
      pageNum = parseInt(escape(page as string).trim());
    }
  }

  //validate and set the correct limit for page pagination
  let limitNum: number = 10;
  if (limit) {
    if (!isNumber(limit as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "limit" search parameter.',
        params: ['limit'],
      };
      res.status(400).json(error);
      createLog('error', req, res, error);
      return;
    } else {
      if (parseInt(escape(limit as string).trim()) > 10) {
        limitNum = 10;
      } else {
        limitNum = parseInt(escape(limit as string).trim());
      }
    }
  }

  // Validate and set the correct month (collection name) parameter
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
      res.status(400).json(error);
      createLog('error', req, res, error);
      return;
    } else {
      collectionName = `logs_${monthString}`;
    }
  } else {
    // Default to the current month if no "month" parameter is provided
    const now = moment();
    const year = now.format('YYYY');
    const month = now.format('MM');
    collectionName = `logs_${year}_${month}`;
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
    const collection = await getLogModelForMonth(collectionName);
    const logs = await collection.paginate(searchData, options);

    if (logs.docs.length == 0) {
      const error: ErrorReturn = {
        code: 404,
        message: 'no logs found',
      };
      res.status(404).json(error);
      return;
    }

    const result = {
      currentPage: pageNum,
      totalPages: logs.totalPages,
      numberOfResults: logs.docs.length,
      totalNumberOfResults: logs.totalDocs,
      logs: logs.docs,
    };
    res.status(200).json(result);
    return;
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return;
  }
};
