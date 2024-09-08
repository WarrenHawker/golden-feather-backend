import express from 'express';
import getHomepageVideos from '../../controllers/video-controllers/get-videos.controller';

export const router = express.Router();

router.get('/', getHomepageVideos);
