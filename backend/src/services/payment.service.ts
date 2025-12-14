import Stripe from 'stripe';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Sweet from '../models/Sweet';
import { OrderService } from './order.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any
});

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173/success';

export class PaymentService {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    async createCheckoutSession(userId: string) {
        // 1. Get User's Cart
        const cart = await Cart.findOne({ userId }).populate('items.sweetId');
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // 2. Validate Stock
        for (const item of cart.items) {
            const sweet = await Sweet.findById(item.sweetId);
            if (!sweet) {
                throw new Error(`Sweet not found: ${item.sweetId}`);
            }
            if (sweet.quantity < item.quantity) {
                throw new Error(`Insufficient stock for sweet: ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}`);
            }
        }

        // 3. Create Line Items for Stripe
        const line_items = cart.items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.sweetId.name,
                },
                unit_amount: Math.round(item.sweetId.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        // 4. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${CLIENT_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}?canceled=true`, // We might want a different cancel URL
            metadata: {
                userId: userId.toString()
            }
        });

        return session;
    }

    async handlePaymentSuccess(sessionId: string) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const userId = session.metadata?.userId;
            if (!userId) {
                throw new Error('No user ID found in session metadata');
            }

            // Creating the order using existing OrderService logic
            // Note: OrderService.createOrder deduces stock and clears cart.
            // We should ideally ensure this is idempotent or check if order already exists for this session.
            // For now, we assume one-time success call per session.
            // We could store session ID in order to prevent duplicates.

            // We need to modify OrderService or Order model to store paymentId if we want to track it.
            // I'll update OrderService to accept paymentId optional param.

            const order = await this.orderService.createOrder(userId, sessionId);
            return order;
        } else {
            throw new Error('Payment not completed');
        }
    }
}
