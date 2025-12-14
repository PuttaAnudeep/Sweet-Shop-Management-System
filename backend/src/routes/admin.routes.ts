import express from 'express';
import { getStats } from '../controllers/admin.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/stats', authenticate, isAdmin, getStats);

export default router;
