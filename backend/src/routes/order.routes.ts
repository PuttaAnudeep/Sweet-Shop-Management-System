import { Router } from 'express';
import { placeOrder, getOrderHistory, checkout, handleSuccess } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticate, checkout);
router.get('/success', handleSuccess); // Success callback doesn't have auth header usually, but we need to identify session. It uses session_id query param.
// Note: if handleSuccess needs to be authenticated, we might have an issue since redirect from Stripe won't carry the JWT.
// But we are using session_id to retrieve userId from metadata, so that should be secure enough for this simple implementation.

router.post('/', authenticate, placeOrder); // Keep old one or deprecate? Plan didn't say. Let's keep it.
router.get('/', authenticate, getOrderHistory);

export default router;
