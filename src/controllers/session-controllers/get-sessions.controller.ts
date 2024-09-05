/**
 * @file get-sessions.controller.ts
 * @description Controller for retrieving all active user sessions from the session store. This controller
 *              checks for the presence of a session store and attempts to retrieve all sessions. If the
 *              session store is not found or an error occurs during retrieval, an appropriate error response
 *              is returned. The controller also logs any errors or critical issues encountered during the process.
 *
 * @module controllers/session
 *
 * @function getSessions - Express middleware function to handle GET requests for retrieving all active sessions
 *                         from the session store.
 *
 * @param {Request} req - The Express request object, used to access the session store.
 * @param {Response} res - The Express response object used to send the HTTP response with session data or an error message.
 *
 * @returns {Promise<void>} - A promise that resolves when the session retrieval process is complete, sending an HTTP
 *                            response with either the session data or an appropriate error message.
 *
 * @throws {Error} - Throws a 404 error if the session store is not found, a 404 error if no sessions are found,
 *                   and a 500 error for any issues during the retrieval process. All errors are logged accordingly.
 *
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires ../../services/logger.service - Service to log errors and critical issues.
 */

import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import createLog from '../../services/logger.service';

const getSessions = async (req: Request, res: Response) => {
  if (!req.sessionStore) {
    const error: ErrorReturn = {
      code: 404,
      message: 'Session store not found.',
    };
    res.status(404).json(error);
    createLog('error', req, res, error);
    return;
  }

  req.sessionStore.all!((err, sessions) => {
    if (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      res.json(error);
      createLog('critical', req, res, error);
      return;
    }
    if (!sessions?.length) {
      const error: ErrorReturn = {
        code: 404,
        message: 'No sessions found.',
      };
      res.status(404).json(error);
      createLog('error', req, res, error);
      return;
    }
    res.status(200).json(sessions);
  });
};

export default getSessions;
