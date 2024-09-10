import { Prisma } from '@prisma/client';
import prismaClient from '../../../lib/prisma/client.prisma';
import { GetCreatorSearchParams } from '../../../types/creator';

export const getPublicCreatorsDB = async (
  options: GetCreatorSearchParams = {}
) => {
  const { page = 1, limit = 12, name, languages, tags } = options;

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
    status: 'public',
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
        excerpt: true,
        slug: true,
        socials: true,
        videoUrl: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        languages: {
          select: {
            language: {
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
        language: creator.languages.map((c) => c.language.name),
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
