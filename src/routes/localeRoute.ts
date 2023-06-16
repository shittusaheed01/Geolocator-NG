import {Router} from 'express';

import {getLgas, getLocale, getRegions, getStates} from '../controllers/localeController';
const router = Router();

router.get('/', getLocale);
router.get('/regions', getRegions);
router.get('/states', getStates);
router.get('/lgas', getLgas);


export default router;