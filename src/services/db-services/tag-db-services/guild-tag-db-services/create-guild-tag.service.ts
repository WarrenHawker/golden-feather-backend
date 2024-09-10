import prismaClient from '../../../../lib/prisma/client.prisma';
import { TagCreationData } from '../../../../types/tag';

const createGuildTagDB = async (data: TagCreationData) => {
  try {
    const newGuildTag = await prismaClient.guildTag.create({ data });
    return newGuildTag;
  } catch (error) {
    throw error;
  }
};

export default createGuildTagDB;
