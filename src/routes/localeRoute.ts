import {Router} from 'express';

import {getLgas, getLocale, getRegions, getStates} from '../controllers/localeController';

import {cache} from '../utils/cacheMiddleware'

import {verifyToken} from '../utils/apiKeyValidation';

const router = Router();

router.use(verifyToken);

router.get('/', cache, getLocale);
router.get('/regions', cache, getRegions);
router.get('/states', cache, getStates);
router.get('/lgas', cache, getLgas);


export default router;