import { Router } from 'express';
import { placeOrder, getOrderHistory } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, placeOrder);
router.get('/', authenticate, getOrderHistory);

export default router;
