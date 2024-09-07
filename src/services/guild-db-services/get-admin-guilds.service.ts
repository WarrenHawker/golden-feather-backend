import { Prisma } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';
import { GetGuildSearchParams } from '../../types/guild';

const getAdminGuildsDB = async (options: GetGuildSearchParams = {}) => {
  const {
    page = 1,
    limit = 12,
    name,
    language,
    tags,
    status,
    region,
  } = options;

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
    ...(status && {
      status: {
        equals: status,
      },
    }),
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
        description: true,
        slug: true,
        socials: true,
        created_on: true,
        updated_on: true,
        status: true,
        language: {
          select: {
            name: true,
          },
        },
        region: {
          select: {
            name: true,
          },
        },
        userId: true,
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

export default getAdminGuildsDB;
