import { Queue } from 'bullmq';
import syncRedisTask from './tasks/sync-redis-task.service';
import { twitchTokenTask } from './tasks/twitch-token-task.service';
import healthCheckTask from './tasks/health-check-task.service';
import logReportTask from './tasks/log-report-task.service';

let twitchTokenQueue: Queue;
let syncRedisQueue: Queue;
let healthCheckQueue: Queue;
let logReportQueue: Queue;

const startScheduledTasks = () => {
  twitchTokenQueue = new Queue('twitchValidationQueue');
  syncRedisQueue = new Queue('redisSyncQueue');
  healthCheckQueue = new Queue('healthCheckQueue');
  logReportQueue = new Queue('logReportQueue');

  // 1. Twitch API Key Validation (every hour)
  twitchTokenQueue.add(
    'validateTwitchToken',
    { priority: 3 },
    {
      repeat: { every: 60 * 60 * 1000 }, //Every 1 hour
      removeOnComplete: true,
    }
  );

  // 2. Redis Sync (every 6 hours)
  syncRedisQueue.add(
    'resyncRedis',
    { priority: 4 },
    {
      repeat: { every: 6 * 60 * 60 * 1000 }, // Every 6 hours
      removeOnComplete: true,
    }
  );

  // 3. Health Checks (every 15 minutes)
  healthCheckQueue.add(
    'runHealthChecks',
    { priority: 1 },
    {
      repeat: { every: 15 * 60 * 1000 }, // Every 15 minutes
      removeOnComplete: true,
    }
  );

  // 4. Log Report Generation (every 24 hours)
  logReportQueue.add(
    'generateLogReport',
    { priority: 2 },
    {
      repeat: { pattern: '0 0 * * *' }, // Every day at midnight
      removeOnComplete: true,
    }
  );

  // syncRedisTask();
  // twitchTokenTask();
  // healthCheckTask();
  // logReportTask();
};
export default startScheduledTasks;
