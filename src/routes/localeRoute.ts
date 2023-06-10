import {Router} from 'express';

import {getLocale} from '../controllers/localeController';
const router = Router();

router.get('/', getLocale);


export default router;