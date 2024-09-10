import express from 'express';
import getLanguages from '../../controllers/language-controllers/get-languages.controller';
import createLanguage from '../../controllers/language-controllers/create-language.controller';
import deleteLanguage from '../../controllers/language-controllers/delete-language.controller';
import updateLanguage from '../../controllers/language-controllers/update-language.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';

export const router = express.Router();

router.get('/', getLanguages);

//creating, updating or deleting languages can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.post('/', createLanguage);
router.patch('/:id', updateLanguage);
router.delete('/:id', deleteLanguage);
