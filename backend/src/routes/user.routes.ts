import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/user.controller';

const router = express.Router();

router.post('/favorites', authenticate, addFavorite);
router.delete('/favorites/:sweetId', authenticate, removeFavorite);
router.get('/favorites', authenticate, getFavorites);

export default router;
