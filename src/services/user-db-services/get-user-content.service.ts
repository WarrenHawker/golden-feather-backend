import prismaClient from '../../lib/prisma/client.prisma';

const getUserContent = async (userId: string) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { guild: true, creator: true },
    });
    if (!user) {
      throw new Error('user not found');
    }

    return {
      userGuildId: user.guild?.id || null,
      userCreatorId: user.creator?.id || null,
    };
  } catch (error) {
    throw error;
  }
};

export default getUserContent;
