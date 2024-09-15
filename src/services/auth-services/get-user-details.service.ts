import prismaClient from '../../lib/prisma/client.prisma';
import { CustomError } from '../../types/custom-error';

const getUserDetails = async (userId: string) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        guild: true,
        creator: true,
        authProviders: true,
        devices: true,
      },
    });

    if (!user) {
      throw new CustomError('user not found', 404);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export default getUserDetails;
