import {Router} from 'express';
import { deleteRental, getRentals } from '../controllers/rentalsController.js';

const router = Router();

router.get('/rentals', getRentals);
router.delete('/rentals/:id', deleteRental);

export default router;