import {Router} from 'express';
import { addRental, deleteRental, getRentals } from '../controllers/rentalsController.js';

const router = Router();

router.get('/rentals', getRentals);
router.delete('/rentals/:id', deleteRental);
router.post('/rentals', addRental);

export default router;