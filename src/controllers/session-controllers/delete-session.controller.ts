/**
 * @file delete-session.controller.ts
 * @description Controller for handling the deletion of a user session by session ID. This controller
 *              checks for the presence of the required session ID parameter in the request and ensures
 *              that the session store is available before attempting to delete the session. If the
 *              session is successfully deleted, a success response is returned. The controller also
 *              logs errors and relevant actions using the logging service.
 *
 * @module controllers/session
 *
 * @function deleteSession - Express middleware function to handle DELETE requests for deleting a user session
 *                           based on the session ID provided in the request URL parameters.
 *
 * @param {Request} req - The Express request object, expected to contain the session ID as a URL parameter.
 * @param {Response} res - The Express response object used to send the HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the session deletion process is complete,
 *                            sending an HTTP response with the appropriate status code.
 *
 * @throws {Error} - Throws a 400 error if the session ID is missing, a 404 error if the session store
 *                   is not found, and logs any errors encountered during the process.
 *
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires ../../services/logger.service - Service to log errors and actions.
 */

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';

export const deleteSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  const missingParams = [];
  if (!sessionId) {
    missingParams.push('userId');
  }
  if (missingParams.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Missing url parameters',
      params: missingParams,
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  if (!req.sessionStore) {
    const error: ErrorReturn = {
      code: 404,
      message: 'Session store not found.',
    };
    res.status(404).json(error);
    createLog('error', req, res, error);
    return;
  }

  req.sessionStore.destroy(sessionId, (err) => {
    res.sendStatus(200);
    createLog('info', req, res);
  });
};
