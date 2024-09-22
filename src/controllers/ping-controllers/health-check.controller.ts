import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../types/custom-error';
import axios from 'axios';
import { Queue } from 'bullmq';
import mongoose from 'mongoose';
import prismaClient from '../../lib/prisma/client.prisma';
import { IOredisClient } from '../../lib/redis/client.redis';
import { generateTwitchToken } from '../../services/scheduled-tasks/tasks/twitch-token-task.service';

const checkServerHealth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Server uptime
    const uptime = process.uptime();

    //mongoDB check
    let mongoHealth = 'disconnected';
    try {
      const mongo = mongoose.connection.db;
      if (mongo) {
        const mongoPing = await mongo.admin().ping();
        mongoHealth = mongoPing.ok ? 'connected' : 'disconnected';
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }

    // Postgres check
    let postgresHealth = 'disconnected';
    try {
      const postgresPing = await prismaClient.$queryRaw`SELECT NOW()`;
      postgresHealth =
        (postgresPing as any[]).length > 0 ? 'connected' : 'disconnected';
    } catch (error) {
      console.error('Postgres connection error:', error);
    }

    //redis check
    let redisHealth = 'disconnected';
    try {
      const redisPing = await IOredisClient!.ping();
      redisHealth = redisPing === 'PONG' ? 'connected' : 'disconnected';
    } catch (error) {
      console.error('Redis connection error:', error);
    }

    // Check twitch api
    let twitchHealth = 'disconnected';
    try {
      let token = await IOredisClient!.hget('twitch_token', 'token_id');
      if (!token) {
        token = await generateTwitchToken();
      }
      const twitchPing = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID,
        },
      });
      twitchHealth = twitchPing.status === 200 ? 'connected' : 'disconnected';
    } catch (error) {
      console.error('Twitch API connection error:', error);
    }

    // Check BullMQ queue health
    let queueHealth = 'disconnected';
    try {
      const reportQueue = new Queue('dailyReport');
      const queueCounts = await reportQueue.getJobCounts();
      queueHealth = queueCounts ? 'connected' : 'disconnected';
    } catch (error) {
      console.error('BullMQ queue health check error:', error);
    }

    const healthStatus = {
      serverUptime: uptime,
      databases: {
        mongoDB: mongoHealth,
        postgres: postgresHealth,
        redis: redisHealth,
      },
      externalApi: {
        twitch: twitchHealth,
      },
      bullMQ: queueHealth,
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default checkServerHealth;
