import prismaClient from '../../../lib/prisma/client.prisma';

const deleteRegionDB = async (id: string) => {
  try {
    const deletedRegion = await prismaClient.region.delete({
      where: { id: id },
    });
    return deletedRegion;
  } catch (error) {
    throw error;
  }
};

export default deleteRegionDB;
