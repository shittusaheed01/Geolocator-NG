import {Router} from 'express';

import {cache, getLgas, getLocale, getRegions, getStates} from '../controllers/localeController';

import {verifyToken} from '../utils/apiKeyValidation';

const router = Router();

router.use(verifyToken);

router.get('/', cache, getLocale);
router.get('/regions', cache, getRegions);
router.get('/states', cache, getStates);
router.get('/lgas', cache, getLgas);


export default router;