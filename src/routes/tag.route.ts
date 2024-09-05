import express from 'express';
import getCreatorTags from '../controllers/tag-controllers/get-creator-tags.controller';
import getGuildTags from '../controllers/tag-controllers/get-guild-tags.controller';

export const router = express.Router();

router.get('/creator', getCreatorTags);
router.get('/guild', getGuildTags);
