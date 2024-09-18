import request from 'supertest';
import { Server } from 'http';
import express from 'express';
import IORedis from 'ioredis';
import 'dotenv/config';
import { app } from '../app';
import { startServer } from '../server';
import { IOredisClient } from '../lib/redis/client.redis';

// const redisUrl = process.env.REDIS_URL || '';

// const IOredisClient = new IORedis(redisUrl, {
//   connectTimeout: 50000,
//   maxRetriesPerRequest: null,
//   lazyConnect: true,
// });

// IOredisClient.on('error', (err) => console.error('IORedis Client Error', err));
// IOredisClient.on('connect', () => console.log('IORedis Client Connected'));
// IOredisClient.on('close', () => console.log('IORedis connection closed'));

// const app = express();
// let server: Server;

// app.get('/api/v1/guild', (req, res) => {
//   res.sendStatus(200);
// });

beforeAll(async () => {
  // server = app.listen(5001);
  // await IOredisClient.connect();
  console.log('server running for tests');
});

afterAll(async () => {
  await IOredisClient.quit();
  IOredisClient.removeAllListeners();
  console.log('Server closed.');
});

describe('GET /guilds', () => {
  it('should fetch guilds from Redis if they exist', async () => {
    const response = await request(server)
      .get('/api/v1/guild')
      .set('X-Test-Request', 'true')
      .expect(200);
  });
});
