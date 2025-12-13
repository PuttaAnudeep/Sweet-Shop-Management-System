import Cart, { ICartItem } from '../models/Cart';

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
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(p => p.sweetId.toString() === item.sweetId.toString());

        if (existingItemIndex > -1) {
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
