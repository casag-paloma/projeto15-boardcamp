import {Router} from 'express';
import { addRental, closeRentalById, deleteRental, getRentals } from '../controllers/rentalsController.js';

const router = Router();

router.get('/rentals', getRentals);
router.delete('/rentals/:id', deleteRental);
router.post('/rentals', addRental);
router.post('/rentals/:id/return', closeRentalById);

export default router;