import { Router } from 'express';
import userRouter from './user';
import authRouter from './auth';
import roomRouter from './room';

const router: Router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/rooms', roomRouter);

export default router;
