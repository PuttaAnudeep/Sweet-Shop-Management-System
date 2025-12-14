import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch((err) => console.error('MongoDB connection error:', err));
}

import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';
import inventoryRoutes from './routes/inventory.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';

app.use(helmet());
app.use(cors());
app.use(express.json());

import adminRoutes from './routes/admin.routes';

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Sweet Shop API is running');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
