import { Router } from 'express';
import { createSweet } from '../controllers/sweet.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['admin']), createSweet);

export default router;
