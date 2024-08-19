import { Queue, tryCatch, Worker } from 'bullmq';
import { IOredisClient, redisClient } from '../lib/redis/client.redis';
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
    return response.data.access_token;
  } catch (error) {
    throw error;
  }
};

const maintainTwitchToken = async () => {
  const hour = 60 * 60 * 1000;
  const maintainToken = new Queue('maintainToken', redisConnect);
  await maintainToken.add('tasks', {}, { repeat: { every: hour } });

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
            const newToken = await generateTwitchToken();
            redisClient.hSet('twitch_token', 'token_id', newToken);
          }
        } else {
          //if there's no token in redis, generate a new token and store in redis
          const newToken = await generateTwitchToken();
          redisClient.hSet('twitch_token', 'token_id', newToken);
        }
      }
    },
    redisConnect
  );
};

export default maintainTwitchToken;
