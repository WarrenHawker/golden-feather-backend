//TODO Change authprovider password if password is passed as options

import { Prisma, UserStatus, UserRole } from '@prisma/client';
import prismaClient from '../../../lib/prisma/client.prisma';
import { UserUpdateData } from '../../../types/user';

const updateUserDB = async (userId: string, options: UserUpdateData) => {
  let { username, email, password, role, status, guildId, creatorId } = options;
  try {
    /*
      if either guildId or creatorId is given, check those records exist 
      and are not already linked to another user. If either case happens the 
      user will be created without linking to the new guild or creator profile.
      A warning will be returned with the updated user. 
    */

    let warningMessage1 = '';
    let guild;
    if (guildId) {
      guild = await prismaClient.guild.findUnique({
        where: { id: guildId },
        include: {
          user: true,
        },
      });
      if (!guild) {
        warningMessage1 =
          'Guild not found. User will be updated without a linked guild.';
      } else if (guild.user) {
        warningMessage1 =
          'Guild is already linked to another user. User will be updated without linking the guild.';
      }
    }

    let warningMessage2 = '';
    let creator;
    if (creatorId) {
      creator = await prismaClient.creator.findUnique({
        where: { id: creatorId },
        include: {
          user: true,
        },
      });
      if (!creator) {
        warningMessage2 =
          'Creator profile not found. User will be updated without a linked creator profile.';
      } else if (creator.user) {
        warningMessage2 =
          'Creator profile is already linked to another user. User will be updated without linking the creator profile.';
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      username: username ? username : undefined,
      email: email ? email : undefined,
      status: status ? (status as UserStatus) : undefined,
      role: role ? (role as UserRole) : undefined,
      updated_on: new Date(),
      guild: guild && !guild.user ? { connect: { id: guildId } } : undefined,
      creator:
        creator && !creator.user ? { connect: { id: creatorId } } : undefined,
    };
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { updatedUser, warningMessage1, warningMessage2 };
  } catch (error) {
    throw error;
  }
};

export default updateUserDB;
