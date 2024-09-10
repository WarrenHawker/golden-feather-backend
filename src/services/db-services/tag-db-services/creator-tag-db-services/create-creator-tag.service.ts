import prismaClient from '../../../../lib/prisma/client.prisma';
import { TagCreationData } from '../../../../types/tag';

const createCreatorTagDB = async (data: TagCreationData) => {
  try {
    const newCreatorTag = await prismaClient.creatorTag.create({ data });
    return newCreatorTag;
  } catch (error) {
    throw error;
  }
};

export default createCreatorTagDB;
