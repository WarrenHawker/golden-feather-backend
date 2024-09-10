import prismaClient from '../../../../lib/prisma/client.prisma';
import { TagUpdateData } from '../../../../types/tag';

const updateGuildTagDB = async (tagId: string, data: TagUpdateData) => {
  try {
    const updatedGuildTag = await prismaClient.guildTag.update({
      where: { id: tagId },
      data,
    });
    return updatedGuildTag;
  } catch (error) {
    throw error;
  }
};

export default updateGuildTagDB;
