import { unescape } from 'validator';
import prismaClient from '../../../lib/prisma/client.prisma';
import { GuildCreationData } from '../../../types/guild';

const createGuildDB = async (options: GuildCreationData) => {
  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another guild. If either case happens the guild will
      be created without a linked user and a warning returned with
      the new guild. 
    */
    let warningMessage = '';
    let user;

    if (options.userId) {
      user = await prismaClient.user.findUnique({
        where: { id: options.userId },
        include: {
          guild: true,
        },
      });

      if (!user) {
        warningMessage =
          'User not found. Guild will be created without a linked user.';
      } else if (user.guild) {
        warningMessage =
          'User is already linked to another guild. Guild will be created without linking the user.';
      }
    }

    const newGuildData = {
      name: options.name,
      slug: unescape(options.name)
        .toLowerCase()
        .replace(/\//g, '-')
        .replace(/\s+/g, '-'),
      description: options.description,
      excerpt: options.excerpt,
      guildLeader: options.guildLeader,
      videoUrl: options.videoUrl,
      status: options.status,
      ...(options.tags.length > 0 && {
        tags: {
          create: options.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: {
                  name: tag,
                  description: `${tag} related content.`,
                },
              },
            },
          })),
        },
      }),
      ...(options.languages.length > 0 && {
        languages: {
          create: options.languages.map((language) => ({
            language: {
              connectOrCreate: {
                where: { name: language },
                create: {
                  name: language,
                },
              },
            },
          })),
        },
      }),
      ...(options.regions.length > 0 && {
        regions: {
          create: options.regions.map((region) => ({
            region: {
              connectOrCreate: {
                where: { name: region },
                create: {
                  name: region,
                },
              },
            },
          })),
        },
      }),
      socials: options.socials,
      user:
        user && !user.guild ? { connect: { id: options.userId } } : undefined,
    };

    const newGuild = await prismaClient.guild.create({
      data: newGuildData,
    });
    return { newGuild, warningMessage };
  } catch (error) {
    throw error;
  }
};

export default createGuildDB;
