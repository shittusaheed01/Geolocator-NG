import {Router} from 'express';

import {getUser, createUser, loginUser} from '../controllers/userControllers';
import {RegisterValidation, LoginValidation} from '../utils/userValidation';

const router = Router();

router.get('/', getUser);
router.post('/signup', RegisterValidation, createUser);
router.post('/login', LoginValidation, loginUser);

export default router;