import { prismaClient } from '../../lib/prisma/client.prisma';

export const getUserByIdDB = async (id: string) => {
  try {
    const user = prismaClient.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_on: true,
        updated_on: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
