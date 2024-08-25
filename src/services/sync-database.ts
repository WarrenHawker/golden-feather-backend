import { Queue, Worker } from 'bullmq';
import { prismaClient } from '../lib/prisma/client.prisma';
import { IOredisClient, redisClient } from '../lib/redis/client.redis';

const redisConnect = {
  connection: IOredisClient,
};

export const prefetchGuilds = async () => {
  redisClient.del('guilds');
  try {
    const guilds = await prismaClient.publicGuild.findMany({
      orderBy: { created_on: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        guild_leader: true,
        region: true,
        language: true,
        description: true,
      },
    });
    guilds.forEach((guild) => {
      redisClient.hSet('guilds', guild.id, JSON.stringify(guild));
    });
  } catch (error) {
    throw error;
  }
};

export const prefetchCreators = async () => {
  redisClient.del('content_creators');
  try {
    const creators = await prismaClient.publicContentCreator.findMany({
      orderBy: { created_on: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        description: true,
        socials: true,
        videoUrl: true,
        language: true,
      },
    });
    creators.forEach((creator) => {
      redisClient.hSet('content_creators', creator.id, JSON.stringify(creator));
    });
  } catch (error) {
    throw error;
  }
};

export const syncDatabase = async () => {
  const hour6 = 6 * 60 * 60 * 1000;
  const maintainToken = new Queue('maintainToken', redisConnect);
  await maintainToken.add(
    'tasks',
    {},
    { repeat: { every: hour6 }, removeOnComplete: true }
  );

  new Worker(
    'maintainToken',
    async (job) => {
      if (job.name == 'tasks') {
        await prefetchCreators();
        await prefetchGuilds();
      }
    },
    redisConnect
  );
};
