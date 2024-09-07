/**
 * @file get-creator-tags-db.service.ts
 * @description Service function for retrieving two sets of creator tags from the database:
 *              1. `publicTags`: Tags that are linked only to creators with a status of "public".
 *              2. `allTags`: Tags that are linked to creators with any status.
 *              This function queries the database to fetch both sets of tags and returns them in an
 *              object containing `publicTags` and `allTags`. If an error occurs during the database
 *              query, the function throws an error to be handled by the calling function.
 *
 * @module services/creator
 *
 * @function getCreatorTagsDB - Asynchronous function to retrieve both public and all creator tags from the database.
 *
 * @returns {Promise<{publicTags: object[], allTags: object[]}>} - A promise that resolves with an object containing two arrays:
 *                                                                `publicTags` (tags linked to public creators) and
 *                                                                `allTags` (tags linked to creators with any status).
 *
 * @throws {Error} - Throws an error if there is an issue with the database queries.
 *
 * @requires ../../lib/prisma/client.prisma - Prisma client for interacting with the database.
 */

import prismaClient from '../../lib/prisma/client.prisma';

const getCreatorTagsDB = async () => {
  try {
    const publicTags = await prismaClient.creatorTag.findMany({
      where: {
        creatorTags: {
          some: {
            creator: {
              status: 'public',
            },
          },
        },
      },
      select: {
        name: true,
      },
    });

    const allTags = await prismaClient.creatorTag.findMany({
      where: {
        creatorTags: {
          some: {},
        },
      },
      select: {
        name: true,
      },
    });

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getCreatorTagsDB;
