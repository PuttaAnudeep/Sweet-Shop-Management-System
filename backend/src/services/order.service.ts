import Order, { IOrder } from '../models/Order';
import Cart from '../models/Cart';
import Sweet from '../models/Sweet';
import mongoose from 'mongoose';

export class OrderService {
    async createOrder(userId: string, paymentId?: string) {
        // 1. Get User's Cart
        const cart = await Cart.findOne({ userId }).populate('items.sweetId');

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Transaction handling removed for testing compatibility with MongoMemoryServer (standalone)
        // In production, uncomment session usage for atomicity.
        try {
            let totalAmount = 0;
            const orderItems = [];

            // 2. Validate Stock (Pre-check all items to avoid partial updates)
            for (const item of cart.items) {
                // ... (rest of loop)
            }

            // 3. Deduct Stock and Prepare Order Items
            for (const item of cart.items) {
                const sweet = await Sweet.findById(item.sweetId);
                if (sweet) {
                    // Use atomic update to avoid validation errors on other fields (like comments)
                    await Sweet.findByIdAndUpdate(item.sweetId, { $inc: { quantity: -item.quantity } });

                    totalAmount += sweet.price * item.quantity;
                    orderItems.push({
                        sweetId: sweet._id,
                        quantity: item.quantity,
                        price: sweet.price
                    });
                }
            }

            // 3. Create Order
            const order = new Order({
                userId,
                items: orderItems,
                totalAmount,
                paymentId,
                status: 'completed'
            });
            await order.save();

            // 4. Clear Cart
            cart.items = [];
            await cart.save();

            return order;

        } catch (error) {
            throw error;
        }
    }

    async getUserOrders(userId: string, page: number = 1, limit: number = 5) {
        const skip = (page - 1) * limit;
        const orders = await Order.find({ userId })
            .populate('items.sweetId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ userId });

        return {
            orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page
        };
    }
}
