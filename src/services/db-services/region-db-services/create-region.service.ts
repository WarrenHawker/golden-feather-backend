import prismaClient from '../../../lib/prisma/client.prisma';

const createRegionDB = async (name: string) => {
  try {
    const newRegion = await prismaClient.language.create({ data: { name } });
    return newRegion;
  } catch (error) {
    throw error;
  }
};

export default createRegionDB;
