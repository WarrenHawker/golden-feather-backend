import prismaClient from '../../../lib/prisma/client.prisma';

const deleteGuildDB = async (id: string) => {
  try {
    const deletedGuild = await prismaClient.guild.delete({
      where: { id: id },
    });
    return deletedGuild;
  } catch (error) {
    throw error;
  }
};

export default deleteGuildDB;
