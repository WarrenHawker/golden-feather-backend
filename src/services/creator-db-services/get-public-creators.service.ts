/**
 * Fetches a paginated list of public content creators from the database based on optional search parameters.
 *
 * The function allows filtering by name, language, and categories. It returns the creators' information along with
 * pagination details such as the current page, total pages, number of entries on the current page, and total entries
 * matching the search criteria.
 *
 * ANY DATA PASSED INTO THIS FUNCTION SHOULD BE FULLY VALIDATED AND SANITISED FIRST
 *
 * @param {SearchParams} options - Optional search parameters:
 *   - page (number): The page number to retrieve. Defaults to 1.
 *   - limit (number): The number of results per page. Defaults to 10.
 *   - name (string): Filter creators by name (case-insensitive, partial match).
 *   - language (string): Filter creators by language name (case-insensitive, exact match).
 *   - categories (string[]): Filter creators by categories (case-insensitive, exact match).
 *
 * @returns {Promise<{pagination: {currentPage: number, totalPages: number, entries: number, totalEntries: number}, creators: Array}>}
 *   - An object containing pagination details and the list of filtered creators.
 *
 * @throws Will throw an error if the database query fails.
 */

import { prismaClient } from '../../lib/prisma/client.prisma';
import { GetCreatorSearchParams } from '../../types/creator';

export const getPublicCreators = async (
  options: GetCreatorSearchParams = {}
) => {
  const { page = 1, limit = 10, name, language, categories } = options;

  try {
    const creators = await prismaClient.publicContentCreator.findMany({
      where: {
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
        ...(categories &&
          categories.length > 0 && {
            AND: categories.map((categoryName) => ({
              categories: {
                some: {
                  category: {
                    name: {
                      equals: categoryName,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            })),
          }),
      },
      orderBy: { created_on: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        socials: true,
        videoUrl: true,
        language: {
          select: {
            name: true,
          },
        },
        categories: {
          select: {
            category: {
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
        categories: creator.categories.map((c) => c.category.name),
      };
    });

    const totalEntries = await prismaClient.publicContentCreator.count({
      where: {
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
        ...(categories &&
          categories.length > 0 && {
            AND: categories.map((categoryName) => ({
              categories: {
                some: {
                  category: {
                    name: {
                      equals: categoryName,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            })),
          }),
      },
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
