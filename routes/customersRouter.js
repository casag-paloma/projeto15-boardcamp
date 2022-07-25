import {Router} from 'express';
import { addCustomer, getCustomers, getCustomersById, updateCustomerById } from '../controllers/customersController.js';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomersById);
router.post('/customers', addCustomer);
router.put('/customers/:id', updateCustomerById);



export default router;