import { prismaClient } from '../../lib/prisma/client.prisma';
import { redisClient } from '../../lib/redis/client.redis';

export const storeGuildsRedis = async () => {
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
    const count = await prismaClient.publicGuild.count();
    const pageination = {
      currentPage: 1,
      totalPages: count < 10 ? 1 : Math.ceil(count / 10),
      entries: count < 10 ? count : 10,
      totalEntries: count,
    };
    redisClient.hSet('guilds', 'pagination', JSON.stringify(pageination));
  } catch (error) {
    throw error;
  }
};
