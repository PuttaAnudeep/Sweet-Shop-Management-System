import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // All cart routes require auth

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:sweetId', removeFromCart);

export default router;
