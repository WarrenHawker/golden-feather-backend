import { ContentStatus, Prisma } from '@prisma/client';
import prismaClient from '../../../lib/prisma/client.prisma';
import { GuildUpdateData } from '../../../types/guild';
import { unescape } from 'validator';
import updateGuildRelations from './update-guild-relations.service';

const updateGuildDB = async (guildId: string, options: GuildUpdateData) => {
  let {
    name,
    description,
    excerpt,
    videoUrl,
    guild_leader,
    regions,
    socials,
    tags,
    languages,
    status,
    userId,
  } = options;

  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another guild. If either case happens the 
      guild will be created without a linked user and a 
      warning returned with the updated guild. 
    */
    let warningMessage = '';
    let user;

    if (options.userId) {
      user = await prismaClient.user.findUnique({
        where: { id: options.userId },
        include: {
          creator: true,
        },
      });

      if (!user) {
        warningMessage =
          'User not found. Guild will be updated without a linked user.';
      } else if (user.creator) {
        warningMessage =
          'User is already linked to another guild profile. Guild will be updated without linking the user.';
      }
    }

    const updateData: Prisma.GuildUpdateInput = {
      name: name ? name : undefined,
      slug: name
        ? unescape(name).toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
        : undefined,
      description: description ? description : undefined,
      excerpt: excerpt ? excerpt : undefined,
      videoUrl: videoUrl ? videoUrl : undefined,
      socials: socials ? socials : undefined,
      guild_leader: guild_leader ? guild_leader : undefined,
      status: status ? (status as ContentStatus) : undefined,
      user: user && !user.creator ? { connect: { id: userId } } : undefined,
      updated_on: new Date(),
    };

    if (tags) {
      const {
        itemsToConnect: tagsToConnect,
        itemsToDisconnect: tagsToDisconnect,
      } = await updateGuildRelations('tags', guildId, tags);

      updateData.tags = {
        disconnect: tagsToDisconnect,
        connectOrCreate: tagsToConnect,
      };
    }

    if (languages) {
      const {
        itemsToConnect: languagesToConnect,
        itemsToDisconnect: languagesToDisconnect,
      } = await updateGuildRelations('languages', guildId, languages);

      updateData.languages = {
        disconnect: languagesToDisconnect,
        connectOrCreate: languagesToConnect,
      };
    }

    if (regions) {
      const {
        itemsToConnect: regionsToConnect,
        itemsToDisconnect: regionsToDisconnect,
      } = await updateGuildRelations('regions', guildId, regions);

      updateData.regions = {
        disconnect: regionsToDisconnect,
        connectOrCreate: regionsToConnect,
      };
    }

    const updatedGuild = await prismaClient.guild.update({
      where: { id: guildId },
      data: updateData,
    });
    return { updatedGuild, warningMessage };
  } catch (error) {
    throw error;
  }
};

export default updateGuildDB;
