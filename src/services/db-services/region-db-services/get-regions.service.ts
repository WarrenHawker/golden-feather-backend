import prismaClient from '../../../lib/prisma/client.prisma';

const getRegionsDB = async () => {
  try {
    const publicData = await prismaClient.region.findMany({
      where: {
        guildsRegion: {
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

    const publicRegions = Array.from(
      new Set(publicData.map((region) => region.name))
    );

    const allRegions = await prismaClient.creatorTag.findMany();
    return { publicRegions, allRegions };
  } catch (error) {
    throw error;
  }
};

export default getRegionsDB;
