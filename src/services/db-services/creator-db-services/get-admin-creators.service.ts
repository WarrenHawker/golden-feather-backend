import { Prisma } from '@prisma/client';
import prismaClient from '../../../lib/prisma/client.prisma';
import { CreatorSearchParams } from '../../../types/creator';

export const getAdminCreatorsDB = async (options: CreatorSearchParams = {}) => {
  const { page = 1, limit = 12, name, languages, tags, status } = options;

  const searchData: Prisma.CreatorWhereInput = {
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),
    ...(languages &&
      languages.length > 0 && {
        AND: languages.map((language) => ({
          languages: {
            some: {
              language: {
                name: {
                  equals: language,
                  mode: 'insensitive',
                },
              },
            },
          },
        })),
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
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        languages: {
          include: {
            language: true,
          },
        },
        user: true,
      },
    });

    const formattedCreators = creators.map((creator) => {
      return {
        ...creator,
        languages: creator.languages.map((c) => c.language.name),
        tags: creator.tags.map((c) => c.tag.name),
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
