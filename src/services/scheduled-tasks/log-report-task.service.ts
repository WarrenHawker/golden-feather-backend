// @ts-nocheck

import { Worker } from 'bullmq';
import { IOredisClient } from '../../lib/redis/client.redis';

const redisConnect = {
  connection: IOredisClient,
};

const logReportTask = async () => {
  new Worker(
    'generateLogReport',
    async () => {
      try {
      } catch (error) {
        throw error;
      }
    },
    redisConnect
  );
};

export default logReportTask;
