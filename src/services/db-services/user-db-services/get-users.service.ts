import { Prisma } from '@prisma/client';
import { GetUserSearchParams } from '../../../types/user';
import prismaClient from '../../../lib/prisma/client.prisma';

const getUsersDB = async (options: GetUserSearchParams = {}) => {
  const { page = 1, limit = 10, username, role, status } = options;

  const searchData: Prisma.UserWhereInput = {
    ...(username && {
      username: {
        contains: username,
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
      orderBy: { createdOn: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdOn: true,
        updatedOn: true,
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

export default getUsersDB;
