import {Router} from 'express';

import {cache, getLgas, getLocale, getRegions, getStates} from '../controllers/localeController';
const router = Router();

router.get('/', cache, getLocale);
router.get('/regions', cache, getRegions);
router.get('/states', cache, getStates);
router.get('/lgas', cache, getLgas);


export default router;