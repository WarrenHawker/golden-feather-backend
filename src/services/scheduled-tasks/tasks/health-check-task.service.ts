// @ts-nocheck
import { Worker } from 'bullmq';
import { IOredisClient } from '../../../lib/redis/client.redis';
import axios from 'axios';

const redisConnect = {
  connection: IOredisClient,
};

const healthCheckTask = async () => {
  const minute15 = 15 * 60 * 1000; //every 15 minutes
  const healthCheckQueue = new Queue('healthCheckQueue', redisConnect);
  await healthCheckQueue.add(
    'runHealthChecks',
    { priority: 1 },
    {
      repeat: { every: minute15 }, // Every 15 minutes
      removeOnComplete: true,
    }
  );
  new Worker(
    'runHealthChecks',
    async () => {
      try {
        const health = await axios.get(
          `${process.env.SERVER_BASE_URL}/ping/health`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HEALTH_CHECK_TOKEN}`,
            },
          }
        );
        if (JSON.stringify(health).includes('disconnected')) {
          //health check failed, email admins
        }
      } catch (error) {
        throw error;
      }
    },
    redisConnect
  );
};

export default healthCheckTask;
