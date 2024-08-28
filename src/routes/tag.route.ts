import express from 'express';
import { getCreatorTags } from '../controllers/tag-controllers/get-creator-tags.controller';

export const router = express.Router();

router.get('/', getCreatorTags);
