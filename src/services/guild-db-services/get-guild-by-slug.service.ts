import prismaClient from '../../lib/prisma/client.prisma';

const getGuildBySlugDB = async (slug: string) => {
  try {
    const guild = prismaClient.guild.findUnique({
      where: { slug: slug },
    });
    return guild;
  } catch (error) {
    throw error;
  }
};

export default getGuildBySlugDB;
