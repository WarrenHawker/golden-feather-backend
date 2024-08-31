/**
 * @file get-admin-creators-db.service.ts
 * @description Service function for retrieving a paginated list of creators from the database based on various
 *              optional search parameters. This function supports filtering by name, language, tags, and status,
 *              and also allows for pagination by specifying the page number and the number of results per page.
 *              The retrieved creators are returned with selected fields and formatted to include their associated
 *              language and tags.
 *
 * @module services/creator
 *
 * @function getAdminCreatorsDB - Asynchronous function to query the database for creators, applying optional filters
 *                                and pagination. The results are sorted by creation date in descending order.
 *
 * @param {GetCreatorSearchParams} [options] - An object containing optional search parameters such as name, language,
 *                                             tags, status, page number, and limit for pagination.
 *
 * @returns {Promise<{pagination: object, creators: object[]}>} - A promise that resolves with an object containing
 *                                                                pagination details and the list of formatted creators.
 *
 * @throws {Error} - Throws an error if there is an issue with the database query.
 *
 * @warning All data passed to this function must be properly validated and sanitized before being passed in
 *          to avoid potential security risks, such as SQL injection or XSS attacks. This function assumes
 *          that validation and sanitization have been handled externally.
 *
 * @requires ../../lib/prisma/client.prisma - Prisma client for interacting with the database.
 * @requires ../../types/creator - Type definition for the structure of the creator search parameters.
 */

import { Prisma } from '@prisma/client';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { GetCreatorSearchParams } from '../../types/creator';

export const getAdminCreatorsDB = async (
  options: GetCreatorSearchParams = {}
) => {
  const { page = 1, limit = 10, name, language, tags, status } = options;

  const searchData: Prisma.CreatorWhereInput = {
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),
    ...(language && {
      language: {
        name: {
          equals: language,
          mode: 'insensitive',
        },
      },
    }),
    ...(tags &&
      tags.length > 0 && {
        AND: tags.map((tag) => ({
          tags: {
            some: {
              tag: {
                name: {
                  equals: tag,
                  mode: 'insensitive',
                },
              },
            },
          },
        })),
      }),
    ...(status && {
      status: {
        equals: status,
      },
    }),
  };

  try {
    const creators = await prismaClient.creator.findMany({
      where: searchData,
      orderBy: { created_on: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        socials: true,
        videoUrl: true,
        created_on: true,
        updated_on: true,
        status: true,
        language: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedCreators = creators.map((creator) => {
      return {
        ...creator,
        language: creator.language.name,
        categories: creator.tags.map((c) => c.tag.name),
      };
    });

    const totalEntries = await prismaClient.creator.count({
      where: searchData,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalEntries / limit),
      entries: creators.length,
      totalEntries,
    };

    return { pagination, creators: formattedCreators };
  } catch (error) {
    throw error;
  }
};