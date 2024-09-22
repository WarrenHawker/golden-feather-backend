const { google } = require('googleapis');
import axios from 'axios';
import { IOredisClient } from '../../lib/redis/client.redis';
import { generateTwitchToken } from '../../services/scheduled-tasks/tasks/twitch-token-task.service';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

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
    const token = await IOredisClient!.hget('twitch_token', 'token_id');
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

const getHomepageVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const youtubeId = process.env.YOUTUBE_CHANNEL_ID || '';
  const twitchId = process.env.TWITCH_CHANNEL_NAME || '';

  try {
    const latestYoutube = await getLatestYoutube(youtubeId);
    const latestTwitch = await getLatestTwitch(twitchId);
    return responseHandler(req, res, 200, { latestYoutube, latestTwitch });
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

export default getHomepageVideos;
