import { Router } from 'express';
import { createSweet, listSweets, deleteSweet, updateSweet } from '../controllers/sweet.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['admin']), createSweet);
router.get('/', listSweets);
router.put('/:id', authenticate, authorize(['admin']), updateSweet);
router.delete('/:id', authenticate, authorize(['admin']), deleteSweet);

export default router;
