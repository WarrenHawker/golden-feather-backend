import prismaClient from '../../../../lib/prisma/client.prisma';

const getGuildTagsDB = async () => {
  try {
    const publicData = await prismaClient.guildTag.findMany({
      where: {
        guildTags: {
          some: {
            guild: {
              status: 'public',
            },
          },
        },
      },
      select: {
        name: true,
      },
    });

    const publicTags = Array.from(new Set(publicData.map((tag) => tag.name)));

    const allTags = await prismaClient.creatorTag.findMany();
    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getGuildTagsDB;
