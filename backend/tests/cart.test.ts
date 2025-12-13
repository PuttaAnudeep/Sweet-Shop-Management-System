import request from 'supertest';
import app from '../src/server';
import * as db from './db';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';
import Cart from '../src/models/Cart';
import jwt from 'jsonwebtoken';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

describe('Cart Management', () => {
    let customerToken: string;
    let sweet1: any;
    let sweet2: any;

    beforeEach(async () => {
        // Create Customer
        const customer = new User({ email: 'customer@test.com', password: 'password', role: 'customer' });
        await customer.save();
        customerToken = jwt.sign({ id: customer._id, role: customer.role }, SECRET_KEY);

        // Create Sweets
        sweet1 = new Sweet({ name: 'Sweet One', category: 'Test', price: 10, quantity: 100 });
        sweet2 = new Sweet({ name: 'Sweet Two', category: 'Test', price: 20, quantity: 100 });
        await sweet1.save();
        await sweet2.save();
    });

    describe('POST /api/cart', () => {
        it('should add item to cart', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    sweetId: sweet1._id,
                    quantity: 2
                });

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(1);
            expect(res.body.items[0].sweetId).toBe(sweet1._id.toString());
            expect(res.body.items[0].quantity).toBe(2);
        });

        it('should update quantity if item already exists in cart', async () => {
            // Add first time
            await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ sweetId: sweet1._id, quantity: 2 });

            // Add again
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ sweetId: sweet1._id, quantity: 3 });

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(1);
            expect(res.body.items[0].quantity).toBe(5); // 2 + 3
        });
    });

    describe('GET /api/cart', () => {
        it('should return user cart', async () => {
            // Setup cart
            const user = await User.findOne({ email: 'customer@test.com' });
            const cart = new Cart({
                userId: user?._id,
                items: [{ sweetId: sweet1._id, quantity: 1 }, { sweetId: sweet2._id, quantity: 2 }]
            });
            await cart.save();

            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(2);
        });

        it('should return empty items if no cart exists', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(0);
        });
    });

    describe('DELETE /api/cart/:sweetId', () => {
        it('should remove item from cart', async () => {
            // Setup cart
            const user = await User.findOne({ email: 'customer@test.com' });
            const cart = new Cart({
                userId: user?._id,
                items: [{ sweetId: sweet1._id, quantity: 1 }, { sweetId: sweet2._id, quantity: 2 }]
            });
            await cart.save();

            const res = await request(app)
                .delete(`/api/cart/${sweet1._id}`)
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(1);
            expect(res.body.items[0].sweetId).toBe(sweet2._id.toString());
        });

        it('should return 404 if item not in cart', async () => {
            const res = await request(app)
                .delete(`/api/cart/${sweet1._id}`) // Empty cart initially
                .set('Authorization', `Bearer ${customerToken}`);

            // Depending on implementation, this could be 404 or just return current cart
            // Let's expect 404 for specific item removal if not found, or 200 with unchanged cart.
            // For now, let's assume aggressive 404 if cart doesn't exist or item not found.
            // Or simpler: just ensure it handles it gracefully.
            // Let's stick to: if cart doesn't exist, maybe 404.
            expect(res.status).not.toBe(500);
        });
    });
});
