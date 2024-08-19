/*
  "get content creator" controller function

  retrives all content creators from the database. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import { prismaClient } from '../../lib/prisma/client.prisma';

export const getCreators = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const admin = req.query.admin; //if admin=true return the data unultered, otherwise return stripped down data

  if (admin == 'true') {
    try {
      //TODO add authentication - return 401 if not authenticated
      const creators = await prismaClient.contentCreator.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!creators) {
        const error: ErrorReturn = {
          code: 404,
          message: 'no creators found',
        };
        res.status(404).json(error);
        return;
      }

      const count = await prismaClient.contentCreator.count();

      res.status(200).json({
        page,
        limit,
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        creators,
      });
      return;
    } catch (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      res.status(500).json(error);
      createLog('critical', req, res, error);
      return;
    }
  } else {
    try {
      const creators = await prismaClient.contentCreator.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status: 'public',
        },
      });

      if (!creators) {
        const error: ErrorReturn = {
          code: 404,
          message: 'no creators found',
        };
        res.status(404).json(error);
        return;
      }

      const count = await prismaClient.contentCreator.count({
        where: { status: 'public' },
      });

      const data = creators.map((creator) => {
        return {
          id: creator.id,
          name: creator.name,
          description: creator.description,
          categories: creator.categories,
          socials: creator.socials,
          videoUrl: creator.videoUrl,
        };
      });
      res.status(200).json({
        page,
        limit,
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        creators: data,
      });
    } catch (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      res.status(500).json(error);
      createLog('critical', req, res, error);
      return;
    }
  }
};
