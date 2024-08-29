/**
 * @file get-homepage-videos.controller.ts
 * @description Controller for retrieving the latest YouTube and Twitch videos for the homepage. This controller
 *              fetches the most recent video from a specified YouTube channel and the latest VOD from a specified
 *              Twitch channel. The YouTube video is retrieved using the YouTube Data API, while the Twitch video
 *              is retrieved using the Twitch API, with authentication handled via a token stored in Redis.
 *
 * @module controllers/videos
 *
 * @function getHomepageVideos - Express middleware function to handle GET requests for retrieving the latest
 *                               YouTube and Twitch videos for the homepage.
 *
 * @param {Request} req - The Express request object, used to initiate the video retrieval process.
 * @param {Response} res - The Express response object used to send the JSON response with the URLs of the latest videos.
 *
 * @returns {Promise<Response>} - A promise that resolves with an HTTP response containing the URLs of the latest
 *                                YouTube and Twitch videos, or an error message.
 *
 * @throws {Error} - Throws a 500 error if there is an issue retrieving the videos from either YouTube or Twitch.
 *                   All errors are logged accordingly.
 *
 * @requires googleapis - The official Node.js client library for accessing Google APIs, used to interact with the YouTube Data API.
 * @requires axios - A promise-based HTTP client used to make requests to the Twitch API.
 * @requires ../../lib/redis/client.redis - Redis client for accessing the token stored in the Redis database.
 * @requires ../../services/logger.service - Service to log critical errors and actions.
 * @requires ../../services/scheduled-tasks/twitch-token.service - Service to generate a new Twitch token if one is not available.
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 */

const { google } = require('googleapis');
import axios from 'axios';
import { redisClient } from '../../lib/redis/client.redis';
import { createLog } from '../../services/logger.service';
import { generateTwitchToken } from '../../services/scheduled-tasks/twitch-token.service';
import { ErrorReturn } from '../../types/error-return';
import { Request, Response } from 'express';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API,
});

const getYoutubePlaylistId = async (youtubeId: string) => {
  try {
    const response = await youtube.channels.list({
      part: 'contentDetails',
      id: youtubeId,
    });

    const playlistId =
      response.data.items[0].contentDetails.relatedPlaylists.uploads;
    return playlistId;
  } catch (error) {
    throw error;
  }
};

const getLatestYoutube = async (channelId: string) => {
  try {
    const playlistId = await getYoutubePlaylistId(channelId);

    const response = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 1,
    });

    const video = response.data.items[0];
    return `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
  } catch (error) {
    throw error;
  }
};

const getLatestTwitch = async (channelId: string) => {
  try {
    //check for token in redis database - if token doesn't exist then generate a new token
    const token = await redisClient.HGET('twitch_token', 'token_id');
    if (!token) {
      await generateTwitchToken();
    }
    //use token to send post request to twitch api to get latest vod
    const response = await axios.get('https://api.twitch.tv/helix/videos', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id: process.env.TWITCH_CHANNEL_ID,
        sort: 'time',
        type: 'archive',
        first: 1,
      },
    });

    const vod = response.data.data[0];
    return vod ? vod.url : null;
  } catch (error) {
    throw error;
  }
};

export const getHomepageVideos = async (req: Request, res: Response) => {
  const youtubeId = process.env.YOUTUBE_CHANNEL_ID || '';
  const twitchId = process.env.TWITCH_CHANNEL_NAME || '';

  try {
    const latestYoutube = await getLatestYoutube(youtubeId);
    const latestTwitch = await getLatestTwitch(twitchId);
    res.status(200).json({ latestYoutube, latestTwitch });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    res.status(500).json(error);
    createLog('critical', req, res, error);
    return;
  }
};
