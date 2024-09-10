import prismaClient from '../../../lib/prisma/client.prisma';
import { findUniqueStrings } from '../../../utils/functions/compare-arays.function';

const updateCreatorRelations = async (
  field: 'tags' | 'languages',
  creatorId: string,
  newItems: string[]
) => {
  try {
    let itemsToDisconnect: any[] = [];
    let itemsToConnect: any[] = [];

    const currentRelations = await prismaClient.creator.findUnique({
      where: { id: creatorId },
      select: {
        [field]: {
          select: {
            [field.slice(0, -1)]: true,
          },
        },
      },
    });

    const currentItemNames =
      currentRelations?.[field].map(
        (relation: any) => relation[field.slice(0, -1)].name
      ) || [];

    itemsToDisconnect = findUniqueStrings(currentItemNames, newItems).map(
      (item) => ({
        [field.slice(0, -1)]: { name: item },
      })
    );

    itemsToConnect = newItems.map((item) => ({
      where: { name: item },
      create: { name: item },
    }));

    return { itemsToConnect, itemsToDisconnect };
  } catch (error) {
    throw error;
  }
};

export default updateCreatorRelations;
