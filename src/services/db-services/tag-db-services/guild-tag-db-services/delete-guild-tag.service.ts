import prismaClient from '../../../../lib/prisma/client.prisma';

const deleteGuildTagDB = async (id: string) => {
  try {
    const deletedGuildTag = await prismaClient.guildTag.delete({
      where: { id: id },
    });
    return deletedGuildTag;
  } catch (error) {
    throw error;
  }
};

export default deleteGuildTagDB;
