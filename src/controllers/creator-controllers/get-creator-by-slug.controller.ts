/**
 * @file get-creator-by-slug.controller.ts
 * @description Controller for handling the retrieval of a creator by their slug.
 *              This controller validates the presence of the slug in the request
 *              parameters, invokes the corresponding service to fetch the creator
 *              data from the database, and returns the result in the HTTP response.
 *              If any error occurs during processing, an appropriate HTTP error code
 *              and message are returned to the client.
 *
 * @module controllers/creator
 *
 * @function getCreatorBySlug - Express middleware function for handling GET requests to
 *                              retrieve a creator by slug.
 *
 * @param {Request} req - The Express request object, expected to contain the slug as a URL parameter.
 * @param {Response} res - The Express response object used to send the JSON response.
 *
 * @returns {Promise<Response>} - A promise that resolves with an HTTP response containing
 *                                either the creator data or an error message.
 *
 * @throws {Error} - Throws a 400 error if the slug parameter is missing, or a 500 error
 *                   if there is an issue with database retrieval.
 *
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires ../../services/creator-db-services/get-creator-by-slug.service - Service to fetch creator data by slug.
 */

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getCreatorBySlugDB } from '../../services/creator-db-services/get-creator-by-slug.service';
import { ISession } from '../../types/express-session';

export const getCreatorBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no slug search param found',
    };
    return res.status(400).json(error);
  }

  try {
    const creator = await getCreatorBySlugDB(slug as string);

    /*
      If the creator is not "public" it can only be accessed by admins.
      Check if there is a valid active admin session before returning 
      the creator object. If the session is invalid, return a 404 not found.
    */

    if (
      (req.session as ISession).role != 'admin' ||
      (req.session as ISession).status != 'active'
    ) {
      const error: ErrorReturn = {
        code: 404,
        message: 'creator not found',
      };
      return res.status(404).json(error);
    }

    return res.status(200).json(creator);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};
