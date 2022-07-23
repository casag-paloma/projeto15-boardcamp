import {Router} from 'express';
import { getCategories, addCategory } from '../controllers/categoriesController.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', addCategory);

export default router;