const { google } = require('googleapis');
import axios from 'axios';
import { redisClient } from '../../lib/redis/client.redis';
import { createLog } from '../../services/logger.service';
import { generateTwitchToken } from '../../services/twitch-token.service';
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
      const newToken = await generateTwitchToken();
      redisClient.hSet('twitch_token', 'token_id', newToken);
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
