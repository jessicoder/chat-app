import { Router } from 'express';
import { roomController } from '../controllers/room.controller';
import { auth } from '../middlewares/auth';

const router: Router = Router();

router.post('/', auth, async (req, res) => roomController.createRoom(req, res));

router.delete('/:id', auth, async (req, res) =>
  roomController.deleteRoom(req, res),
);

router.get('/:id/users', auth, async (req, res) =>
  roomController.getUsersBelongToRoom(req, res),
);

router.get('/:id/messages', auth, async (req, res) =>
  roomController.getMessages(req, res),
);

router.post('/:id/messages', auth, async (req, res) =>
  roomController.sendMessageToRoom(req, res),
);

router.post('/:id/users', auth, async (req, res) =>
  roomController.addUsersToRoom(req, res),
);

export default router;
