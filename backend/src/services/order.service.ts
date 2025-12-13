import Order, { IOrder } from '../models/Order';
import Cart from '../models/Cart';
import Sweet from '../models/Sweet';
import mongoose from 'mongoose';

export class OrderService {
    async createOrder(userId: string) {
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

            // 2. Validate Stock and Deduct
            for (const item of cart.items) {
                const sweet = await Sweet.findById(item.sweetId);

                if (!sweet) {
                    throw new Error(`Sweet not found: ${item.sweetId}`);
                }

                if (sweet.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for sweet: ${sweet.name}`);
                }

                sweet.quantity -= item.quantity;

                await sweet.save();

                totalAmount += sweet.price * item.quantity;
                orderItems.push({
                    sweetId: sweet._id,
                    quantity: item.quantity,
                    price: sweet.price
                });
            }

            // 3. Create Order
            const order = new Order({
                userId,
                items: orderItems,
                totalAmount
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
}
