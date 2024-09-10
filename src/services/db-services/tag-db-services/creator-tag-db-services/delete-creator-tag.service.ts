import prismaClient from '../../../../lib/prisma/client.prisma';

const deleteCreatorTagDB = async (id: string) => {
  try {
    const deletedCreatorTag = await prismaClient.creatorTag.delete({
      where: { id: id },
    });
    return deletedCreatorTag;
  } catch (error) {
    throw error;
  }
};

export default deleteCreatorTagDB;
