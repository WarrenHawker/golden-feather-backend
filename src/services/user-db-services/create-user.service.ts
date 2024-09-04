import { prismaClient } from '../../lib/prisma/client.prisma';
import { UserCreationData } from '../../types/user';

export const createUserDB = async (options: UserCreationData) => {
  const newUserData = {
    name: options.name,
    email: options.email,
    password: options.password,
    role: options.role,
    status: options.status,
  };
  try {
    const newUser = await prismaClient.user.create({
      data: newUserData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};
