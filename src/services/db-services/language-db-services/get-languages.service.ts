import prismaClient from '../../../lib/prisma/client.prisma';

const getLanguagesDB = async () => {
  try {
    const publicData = await prismaClient.language.findMany({
      where: {
        OR: [
          {
            guildLanguages: {
              some: {
                guild: {
                  status: 'public',
                },
              },
            },
          },
          {
            creatorLanguages: {
              some: {
                creator: {
                  status: 'public',
                },
              },
            },
          },
        ],
      },
      select: {
        name: true,
      },
    });

    const publicLangs = Array.from(
      new Set(publicData.map((lang) => lang.name))
    );

    const allLangs = await prismaClient.language.findMany();
    return { publicLangs, allLangs };
  } catch (error) {
    throw error;
  }
};

export default getLanguagesDB;
