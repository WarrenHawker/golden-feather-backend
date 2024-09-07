import express from 'express';
import getLanguages from '../controllers/language-controllers/get-languages.controller';

export const router = express.Router();

router.get('/', getLanguages);
