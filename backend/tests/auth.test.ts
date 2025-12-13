import request from 'supertest';
import app from '../src/server';
import * as db from './db';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Auth Module', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user and return a token', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe('test@example.com');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user and return a token', async () => {
            // Register first
            await request(app).post('/api/auth/register').send({
                email: 'login@example.com',
                password: 'password123'
            });

            // Try login
            const res = await request(app).post('/api/auth/login').send({
                email: 'login@example.com',
                password: 'password123'
            });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('login@example.com');
        });

        it('should fail with wrong password', async () => {
            // Register first
            await request(app).post('/api/auth/register').send({
                email: 'wrong@example.com',
                password: 'password123'
            });

            const res = await request(app).post('/api/auth/login').send({
                email: 'wrong@example.com',
                password: 'wrongpassword'
            });

            expect(res.status).toBe(401);
        });
    });
});
