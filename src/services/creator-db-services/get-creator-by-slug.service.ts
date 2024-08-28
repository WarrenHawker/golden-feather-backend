import { prismaClient } from '../../lib/prisma/client.prisma';

export const getCreatorBySlugDB = async (slug: string) => {
  try {
    const creator = prismaClient.adminCreator.findUnique({
      where: { slug: slug },
    });
    return creator;
  } catch (error) {
    throw error;
  }
};
