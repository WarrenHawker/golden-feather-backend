import prismaClient from '../../../lib/prisma/client.prisma';

const getUserByIdDB = async (id: string) => {
  try {
    const user = prismaClient.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
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

export default getUserByIdDB;
