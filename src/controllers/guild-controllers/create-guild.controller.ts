import { NextFunction, Request, Response } from 'express';
import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';
import { GuildCreationData } from '../../types/guild';

const createGuild = async (req: Request, res: Response, next: NextFunction) => {
  const createData: GuildCreationData = {
    name: req.body.name,
    description: req.body.description,
    excerpt: req.body.excerpt,
    videoUrl: req.body.videoUrl,
    socials: req.body.socials,
    tags: req.body.tags,
    languages: req.body.languages,
    regions: req.body.regions,
    guildLeader: req.body.guildLeader,
    status: req.body.status,
    userId: req.body.userId,
  };

  try {
    const { newGuild, warningMessage } = await createGuildDB(createData);
    return responseHandler(req, res, 201, {
      guild: newGuild,
      warningMessage,
    });
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default createGuild;
