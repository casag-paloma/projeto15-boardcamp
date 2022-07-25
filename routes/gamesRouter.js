import {Router} from 'express';
import { addGame, getGames } from '../controllers/gamesController.js';

const router = Router();

router.get('/games', getGames);
router.post('/games', addGame);

export default router;