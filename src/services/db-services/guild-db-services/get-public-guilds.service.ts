import { Prisma } from '@prisma/client';
import { GetGuildSearchParams } from '../../../types/guild';
import prismaClient from '../../../lib/prisma/client.prisma';

const getPublicGuildsDB = async (options: GetGuildSearchParams = {}) => {
  const { page = 1, limit = 12, name, language, tags, region } = options;

  const searchData: Prisma.GuildWhereInput = {
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
    status: 'public',
    ...(region && {
      region: {
        name: {
          equals: region,
          mode: 'insensitive',
        },
      },
    }),
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
        region: {
          select: {
            name: true,
          },
        },
        guild_leader: true,
        socials: true,
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

    const formattedGuilds = guilds.map((guild) => {
      return {
        ...guild,
        language: guild.language.name,
        region: guild.region.name,
        categories: guild.tags.map((c) => c.tag.name),
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
