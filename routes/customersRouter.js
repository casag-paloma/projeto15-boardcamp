import {Router} from 'express';
import { addCustomer, getCustomers, getCustomersById } from '../controllers/customersController.js';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomersById);
router.post('/customers', addCustomer);



export default router;