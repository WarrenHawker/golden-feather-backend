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
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';

export const router = express.Router();

const fields: RequiredField[] = [
  {
    name: 'name',
    type: 'string',
    optional: false,
    paramType: 'body',
  },
];

router.get('/', getLanguages);

//creating, updating or deleting languages can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.post('/', validateFields(fields), createLanguage);
router.patch('/:id', validateFields(fields), updateLanguage);
router.delete('/:id', deleteLanguage);
