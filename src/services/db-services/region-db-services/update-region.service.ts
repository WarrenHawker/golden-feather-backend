import prismaClient from '../../../lib/prisma/client.prisma';

const updateRegionDB = async (regionId: string, name: string) => {
  try {
    const updatedRegion = await prismaClient.region.update({
      where: { id: regionId },
      data: { name },
    });
    return updatedRegion;
  } catch (error) {
    throw error;
  }
};

export default updateRegionDB;
