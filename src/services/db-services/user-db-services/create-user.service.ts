import prismaClient from '../../../lib/prisma/client.prisma';
import { UserCreationData } from '../../../types/user';

const createUserDB = async (options: UserCreationData) => {
  const newUserData = {
    username: options.username,
    email: options.email,
    role: options.role,
    status: options.status,
  };
  try {
    const newUser = await prismaClient.user.create({
      data: newUserData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    await prismaClient.authProvider.create({
      data: {
        userId: newUser.id,
        provider: 'credentials',
        password: options.password,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

export default createUserDB;
