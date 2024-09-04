import { prismaClient } from '../../lib/prisma/client.prisma';

export const getUserByIdDB = async (id: string) => {
  try {
    const user = prismaClient.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
