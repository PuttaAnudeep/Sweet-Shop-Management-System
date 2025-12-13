import request from 'supertest';
import app from '../src/server';
import * as db from './db';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';
import Cart from '../src/models/Cart';
import Order from '../src/models/Order';
import jwt from 'jsonwebtoken';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

describe('Order Processing', () => {
    let customerToken: string;
    let sweet: any;
    let user: any;

    beforeEach(async () => {
        // Create Customer
        user = new User({ email: 'customer@test.com', password: 'password', role: 'customer' });
        await user.save();
        customerToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);

        // Create Sweet
        sweet = new Sweet({ name: 'Sweet Order', category: 'Test', price: 10, quantity: 100 });
        await sweet.save();
    });

    describe('POST /api/orders (Checkout)', () => {
        it('should create an order from cart and deduct stock', async () => {
            // 1. Add item to cart
            const cart = new Cart({
                userId: user._id,
                items: [{ sweetId: sweet._id, quantity: 2 }]
            });
            await cart.save();

            // 2. Checkout
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.order).toBeDefined();
            expect(res.body.order.totalAmount).toBe(20); // 2 * 10

            // 3. Verify Stock Deduction
            const updatedSweet = await Sweet.findById(sweet._id);
            expect(updatedSweet?.quantity).toBe(98); // 100 - 2

            // 4. Verify Cart is Empty
            const updatedCart = await Cart.findOne({ userId: user._id });
            expect(updatedCart?.items).toHaveLength(0);
        });

        it('should fail if cart is empty', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/empty/i);
        });

        it('should fail if insufficient stock', async () => {
            // Add item requesting more than available stock
            const cart = new Cart({
                userId: user._id,
                items: [{ sweetId: sweet._id, quantity: 150 }]
            });
            await cart.save();

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(400); // Or 409 Conflict
            expect(res.body.message).toMatch(/insufficient stock/i);
        });
    });
});
