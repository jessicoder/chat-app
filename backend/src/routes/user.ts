import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authController } from '../controllers/auth.controller';

import { auth } from '../middlewares/auth';

const router: Router = Router();

router.get('/', async (req, res) => userController.getUsers(req, res));

router.post('/', async (req, res) => authController.createUser(req, res));

router.get('/:id/friends', auth, async (req, res, next) =>
  userController.getFriendList(req, res, next),
);

router.post('/:id/friends', auth, async (req, res, next) =>
  userController.addFriend(req, res, next),
);

router.put('/:id/friends', auth, async (req, res, next) =>
  userController.responseFriendRequest(req, res, next),
);

export default router;
