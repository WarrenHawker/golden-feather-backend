import express from 'express';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import getregions from '../../controllers/region-controllers/get-regions.controller';
import createRegion from '../../controllers/region-controllers/create-region.controller';
import updateRegion from '../../controllers/region-controllers/update-region.controller';
import deleteRegion from '../../controllers/region-controllers/delete-region.controller';
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

router.get('/', getregions);

//creating, updating or deleting regions can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.post('/', validateFields(fields), createRegion);
router.patch('/:id', validateFields(fields), updateRegion);
router.delete('/:id', deleteRegion);
