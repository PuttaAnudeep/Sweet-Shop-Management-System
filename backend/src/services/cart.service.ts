import Cart, { ICartItem } from '../models/Cart';
import Sweet from '../models/Sweet';

export class CartService {
    async getCart(userId: string) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        return cart;
    }

    async addToCart(userId: string, item: ICartItem) {
        if (item.quantity <= 0) {
            const error: any = new Error('Quantity must be greater than 0');
            error.statusCode = 400;
            throw error;
        }

        // Verify Sweet Exists
        const sweet = await import('../models/Sweet').then(m => m.default.findById(item.sweetId)); // Dynamic import to avoid circular dependency if any, or just import at top.
        // Actually, let's just use the model. I need to make sure Sweet is imported.
        // I will fix imports in a moment.
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }

        if (sweet.quantity < item.quantity) {
            const error: any = new Error(`Insufficient stock. Available: ${sweet.quantity}`);
            error.statusCode = 400;
            throw error;
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(p => p.sweetId.toString() === item.sweetId.toString());

        if (existingItemIndex > -1) {
            // Check if total quantity exceeds stock
            const newTotal = cart.items[existingItemIndex].quantity + item.quantity;
            if (sweet.quantity < newTotal) {
                const error: any = new Error(`Insufficient stock. Available: ${sweet.quantity}, You already have: ${cart.items[existingItemIndex].quantity} in cart.`);
                error.statusCode = 400;
                throw error;
            }
            // Update quantity
            cart.items[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.items.push(item);
        }

        return await cart.save();
    }

    async removeFromCart(userId: string, sweetId: string) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error: any = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.sweetId.toString() !== sweetId);

        if (cart.items.length === initialLength) {
            const error: any = new Error('Item not found in cart');
            error.statusCode = 404;
            throw error;
        }

        return await cart.save();
    }
}
