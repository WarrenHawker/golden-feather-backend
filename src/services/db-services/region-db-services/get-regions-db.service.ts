import prismaClient from '../../../lib/prisma/client.prisma';

const getRegionsDB = async () => {
  try {
    const data = await prismaClient.region.findMany();
    const regions = data.map((region) => {
      return region.name;
    });
    return regions;
  } catch (error) {
    throw error;
  }
};

export default getRegionsDB;
