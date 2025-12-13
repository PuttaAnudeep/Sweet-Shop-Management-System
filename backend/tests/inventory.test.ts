import request from 'supertest';
import app from '../src/server';
import * as db from './db';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';
import InventoryLog from '../src/models/InventoryLog';
import jwt from 'jsonwebtoken';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

describe('Inventory Management', () => {
    let adminToken: string;
    let customerToken: string;
    let sweet: any;

    beforeEach(async () => {
        // Create Admin
        const admin = new User({ email: 'admin@test.com', password: 'password', role: 'admin' });
        await admin.save();
        adminToken = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY);

        // Create Customer
        const customer = new User({ email: 'customer@test.com', password: 'password', role: 'customer' });
        await customer.save();
        customerToken = jwt.sign({ id: customer._id, role: customer.role }, SECRET_KEY);

        // Create Sweet
        sweet = new Sweet({ name: 'Test Sweet', category: 'Test', price: 10, quantity: 10 });
        await sweet.save();
    });

    describe('POST /api/inventory', () => {
        it('should allow admin to purchase inventory (add stock)', async () => {
            const res = await request(app)
                .post('/api/inventory')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    sweetId: sweet._id,
                    quantity: 50,
                    costPrice: 5,
                    supplier: 'Sugar Factory'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);

            // Check Sweet Quantity
            const updatedSweet = await Sweet.findById(sweet._id);
            expect(updatedSweet?.quantity).toBe(10 + 50);

            // Check Inventory Log
            const log = await InventoryLog.findOne({ sweetId: sweet._id });
            expect(log).not.toBeNull();
            expect(log?.quantity).toBe(50);
            expect(log?.costPrice).toBe(5);
            expect(log?.supplier).toBe('Sugar Factory');
        });

        it('should fail if user is not admin', async () => {
            const res = await request(app)
                .post('/api/inventory')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    sweetId: sweet._id,
                    quantity: 50,
                    costPrice: 5
                });
            expect(res.status).toBe(403);
        });

        it('should fail if sweet does not exist', async () => {
            const res = await request(app)
                .post('/api/inventory')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    sweetId: '5f8d0d55b54764421b7156c9',
                    quantity: 50,
                    costPrice: 5
                });
            expect(res.status).toBe(404);
        });
    });
});
