import { Prisma } from '@prisma/client';
import { GetUserSearchParams } from '../../types/user';
import { prismaClient } from '../../lib/prisma/client.prisma';

export const getUsersDB = async (options: GetUserSearchParams = {}) => {
  const { page = 1, limit = 10, name, role, status } = options;

  const searchData: Prisma.UserWhereInput = {
    ...(name && {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    }),
    ...(role && {
      role: {
        equals: role,
      },
    }),
    ...(status && {
      status: {
        equals: status,
      },
    }),
  };

  try {
    const users = await prismaClient.user.findMany({
      where: searchData,
      orderBy: { created_on: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_on: true,
        updated_on: true,
        guild: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedUsers = users.map((user) => {
      return {
        ...user,
        guild: user.guild?.name,
        creator: user.creator?.name,
      };
    });

    const totalEntries = await prismaClient.user.count({
      where: searchData,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalEntries / limit),
      entries: users.length,
      totalEntries,
    };

    return { pagination, users: formattedUsers };
  } catch (error) {
    throw error;
  }
};
