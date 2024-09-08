import prismaClient from '../../../lib/prisma/client.prisma';

const deleteCreatorDB = async (id: string) => {
  try {
    const deletedCreator = await prismaClient.creator.delete({
      where: { id: id },
    });
    return deletedCreator;
  } catch (error) {
    throw error;
  }
};

export default deleteCreatorDB;
