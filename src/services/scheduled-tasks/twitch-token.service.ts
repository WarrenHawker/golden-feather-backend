/**
 * @file maintain-twitch-token.service.ts
 * @description Service functions for managing the Twitch API token using BullMQ for periodic validation and regeneration.
 *              The `maintainTwitchToken` function schedules a task to run every hour to ensure that the Twitch token stored
 *              in Redis is valid. If the token is invalid or missing, a new token is generated and stored in Redis. The
 *              `validateTwitchToken` function checks the validity of the current token, and the `generateTwitchToken` function
 *              generates a new token using the Twitch OAuth2 API.
 *
 * @module services/twitch
 *
 * @function validateTwitchToken - Asynchronous function to validate the current Twitch API token by making a request to the
 *                                 Twitch OAuth2 validation endpoint.
 *
 * @param {string} token - The Twitch API token to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the token is valid, otherwise `false`.
 *
 * @function generateTwitchToken - Asynchronous function to generate a new Twitch API token using the client credentials flow.
 *                                 The new token is stored in Redis.
 *
 * @returns {Promise<void>} - A promise that resolves when the new token has been generated and stored in Redis.
 *
 * @function maintainTwitchToken - Asynchronous function that uses BullMQ to schedule and execute periodic tasks for validating
 *                                  and regenerating the Twitch API token. The task runs every hour.
 *
 * @returns {Promise<void>} - A promise that resolves when the token maintenance task has been scheduled.
 *
 * @throws {Error} - Throws an error if there is an issue with HTTP requests or Redis operations.
 *
 * @requires bullmq - BullMQ is a Redis-based queue system for handling jobs, used here to schedule and execute periodic tasks.
 * @requires axios - A promise-based HTTP client used to make requests to the Twitch OAuth2 API.
 * @requires ../../lib/redis/client.redis - Redis client configuration for interacting with the Redis database.
 */

import { Queue, Worker } from 'bullmq';
import { IOredisClient, redisClient } from '../../lib/redis/client.redis';
import axios from 'axios';

const redisConnect = {
  connection: IOredisClient,
};

export const validateTwitchToken = async (token: string) => {
  try {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

export const generateTwitchToken = async () => {
  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_SECRET,
          grant_type: 'client_credentials',
        },
      }
    );
    redisClient.hSet('twitch_token', 'token_id', response.data.access_token);
  } catch (error) {
    throw error;
  }
};

export const maintainTwitchToken = async () => {
  const hour = 60 * 60 * 1000;
  const maintainToken = new Queue('maintainToken', redisConnect);
  await maintainToken.add(
    'tasks',
    {},
    { repeat: { every: hour }, removeOnComplete: true }
  );

  new Worker(
    'maintainToken',
    async (job) => {
      if (job.name == 'tasks') {
        const token = await redisClient.HGET('twitch_token', 'token_id');
        if (token) {
          //if there's a current token in the redis, check validation
          const isTokenValid = await validateTwitchToken(token);
          if (!isTokenValid) {
            //if the token is invalid, generate a new token and store in redis
            await generateTwitchToken();
          }
        } else {
          //if there's no token in redis, generate a new token and store in redis
          await generateTwitchToken();
        }
      }
    },
    redisConnect
  );
};
