import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/register', async (req, res, next) =>
  authController.createUser(req, res, next),
);

router.post('/login', async (req, res, next) =>
  authController.login(req, res, next),
);

export default router;
