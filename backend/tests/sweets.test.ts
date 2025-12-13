import request from 'supertest';
import app from '../src/server';
import * as db from './db';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';
import jwt from 'jsonwebtoken';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

describe('Sweets Management', () => {
    let adminToken: string;
    let customerToken: string;

    beforeEach(async () => {
        // Create Admin
        const admin = new User({ email: 'admin@test.com', password: 'password', role: 'admin' });
        await admin.save();
        adminToken = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY);

        // Create Customer
        const customer = new User({ email: 'customer@test.com', password: 'password', role: 'customer' });
        await customer.save();
        customerToken = jwt.sign({ id: customer._id, role: customer.role }, SECRET_KEY);
    });

    describe('POST /api/sweets', () => {
        it('should allow admin to add a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Lava Cake',
                    category: 'Cake',
                    price: 150,
                    quantity: 10
                });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Chocolate Lava Cake');
        });

        it('should fail if user is not authorized (no token)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .send({
                    name: 'Test Sweet',
                    category: 'Test',
                    price: 100,
                    quantity: 5
                });

            expect(res.status).toBe(401);
        });

        it('should fail if user is not an admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    name: 'Test Sweet',
                    category: 'Test',
                    price: 100,
                    quantity: 5
                });

            expect(res.status).toBe(403);
        });
    });

    describe('GET /api/sweets', () => {
        beforeEach(async () => {
            // Seed data
            const sweet1 = new Sweet({ name: 'Chocolate Cake', category: 'Cake', price: 20, quantity: 5 });
            const sweet2 = new Sweet({ name: 'Vanilla Ice Cream', category: 'Ice Cream', price: 10, quantity: 10 });
            const sweet3 = new Sweet({ name: 'Strawberry Cake', category: 'Cake', price: 25, quantity: 8 });
            await sweet1.save();
            await sweet2.save();
            await sweet3.save();
        });

        it('should list all sweets', async () => {
            const res = await request(app).get('/api/sweets');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });

        it('should search sweets by name', async () => {
            const res = await request(app).get('/api/sweets?search=Chocolate');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Chocolate Cake');
        });

        it('should filter sweets by category', async () => {
            const res = await request(app).get('/api/sweets?category=Cake');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    describe('DELETE /api/sweets/:id', () => {
        let sweetToDelete: any;

        beforeEach(async () => {
            sweetToDelete = new Sweet({ name: 'To Delete', category: 'Misc', price: 10, quantity: 1 });
            await sweetToDelete.save();
        });

        it('should allow admin to delete a sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            const check = await Sweet.findById(sweetToDelete._id);
            expect(check).toBeNull();
        });

        it('should return 404 if sweet not found', async () => {
            const res = await request(app)
                .delete(`/api/sweets/5f8d0d55b54764421b7156c9`) // Random valid ID
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });

        it('should fail if user is not admin', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetToDelete._id}`)
                .set('Authorization', `Bearer ${customerToken}`);
            expect(res.status).toBe(403);
        });
    });
    describe('PUT /api/sweets/:id', () => {
        let sweetToUpdate: any;

        beforeEach(async () => {
            sweetToUpdate = new Sweet({ name: 'Old Name', category: 'Old Cat', price: 10, quantity: 5 });
            await sweetToUpdate.save();
        });

        it('should allow admin to update a sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetToUpdate._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'New Name',
                    price: 20
                });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('New Name');
            expect(res.body.price).toBe(20);

            const updatedSweet = await Sweet.findById(sweetToUpdate._id);
            expect(updatedSweet?.name).toBe('New Name');
            expect(updatedSweet?.price).toBe(20);
        });

        it('should return 404 if sweet not found', async () => {
            const res = await request(app)
                .put(`/api/sweets/5f8d0d55b54764421b7156c9`) // Random valid ID
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'New Name' });
            expect(res.status).toBe(404);
        });

        it('should fail if user is not admin', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetToUpdate._id}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ name: 'New Name' });
            expect(res.status).toBe(403);
        });
    });
});
