import {Router} from 'express';
import { getGames } from '../controllers/gamesController.js';

const router = Router();

router.get('/games', getGames);

export default router;