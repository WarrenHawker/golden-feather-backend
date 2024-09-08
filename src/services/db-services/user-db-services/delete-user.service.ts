import prismaClient from '../../../lib/prisma/client.prisma';

const deleteUserDB = async (id: string) => {
  try {
    const deletedUser = await prismaClient.user.delete({
      where: { id: id },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

export default deleteUserDB;
