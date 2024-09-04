import { prismaClient } from '../../lib/prisma/client.prisma';

export const getUserByEmailDB = async (email: string) => {
  try {
    const creator = prismaClient.user.findUnique({
      where: { email: email },
    });
    return creator;
  } catch (error) {
    throw error;
  }
};
