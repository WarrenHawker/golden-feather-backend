/**
 * @file get-creator-by-slug-db.service.ts
 * @description Service function for retrieving a single creator from the database based on their unique slug.
 *              This function queries the database using the provided slug to find and return the corresponding
 *              creator record. If no creator is found or an error occurs during the database query, the function
 *              throws an error to be handled by the calling function.
 *
 * @module services/creator
 *
 * @function getCreatorBySlugDB - Asynchronous function to retrieve a creator from the database using their slug.
 *
 * @param {string} slug - The unique slug identifier for the creator.
 *
 * @returns {Promise<object|null>} - A promise that resolves with the creator object if found, or null if no creator is found.
 *
 * @throws {Error} - Throws an error if there is an issue with the database query.
 *
 * @warning All data passed to this function must be properly validated and sanitized before being passed in
 *          to avoid potential security risks, such as SQL injection or XSS attacks. This function assumes
 *          that validation and sanitization have been handled externally.
 *
 * @requires ../../lib/prisma/client.prisma - Prisma client for interacting with the database.
 */

import prismaClient from '../../lib/prisma/client.prisma';

export const getCreatorBySlugDB = async (slug: string) => {
  try {
    const creator = prismaClient.creator.findUnique({
      where: { slug: slug },
    });

    return creator;
  } catch (error) {
    throw error;
  }
};
