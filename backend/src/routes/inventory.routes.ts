import { Router } from 'express';
import { purchaseInventory } from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['admin']), purchaseInventory);

export default router;
