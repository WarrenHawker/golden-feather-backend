// @ts-nocheck

import { Worker } from 'bullmq';
import { IOredisClient } from '../../../lib/redis/client.redis';
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
    IOredisClient!.hset('twitch_token', 'token_id', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    throw error;
  }
};

export const twitchTokenTask = async () => {
  new Worker(
    'validateTwitchToken',
    async () => {
      try {
        const token = await IOredisClient!.hget('twitch_token', 'token_id');
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
      } catch (error) {
        throw error;
      }
    },
    redisConnect
  );
};
