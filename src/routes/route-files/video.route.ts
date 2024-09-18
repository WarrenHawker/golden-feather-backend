import getHomepageVideos from '../../controllers/video-controllers/get-videos.controller';
import express from 'express';
export const router = express.Router();

router.get('/', getHomepageVideos);
