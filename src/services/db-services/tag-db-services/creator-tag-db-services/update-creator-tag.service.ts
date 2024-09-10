import prismaClient from '../../../../lib/prisma/client.prisma';
import { TagUpdateData } from '../../../../types/tag';

const updateCreatorTagDB = async (tagId: string, data: TagUpdateData) => {
  try {
    const updatedCreatorTag = await prismaClient.creatorTag.update({
      where: { id: tagId },
      data,
    });
    return updatedCreatorTag;
  } catch (error) {
    throw error;
  }
};

export default updateCreatorTagDB;
