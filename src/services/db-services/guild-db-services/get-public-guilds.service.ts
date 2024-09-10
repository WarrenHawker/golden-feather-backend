import { Prisma } from '@prisma/client';
import { GetGuildSearchParams } from '../../../types/guild';
import prismaClient from '../../../lib/prisma/client.prisma';

const getPublicGuildsDB = async (options: GetGuildSearchParams = {}) => {
  const { page = 1, limit = 12, name, languages, tags, regions } = options;

  const searchData: Prisma.GuildWhereInput = {
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
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
    ...(regions &&
      regions.length > 0 && {
        AND: regions.map((region) => ({
          regions: {
            some: {
              region: {
                name: {
                  equals: region,
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
    const guilds = await prismaClient.guild.findMany({
      where: searchData,
      orderBy: { created_on: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        excerpt: true,
        guild_leader: true,
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
        regions: {
          select: {
            region: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedGuilds = guilds.map((guild) => {
      return {
        ...guild,
        regions: guild.regions.map((g) => g.region.name),
        languages: guild.languages.map((g) => g.language.name),
        tags: guild.tags.map((g) => g.tag.name),
      };
    });

    const totalEntries = await prismaClient.guild.count({
      where: searchData,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalEntries / limit),
      entries: guilds.length,
      totalEntries,
    };

    return { pagination, guilds: formattedGuilds };
  } catch (error) {
    throw error;
  }
};

export default getPublicGuildsDB;
