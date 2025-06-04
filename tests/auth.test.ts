import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { userTable } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Authentication API Intergration Tests', () => {
    const testUser = {
        fullName: 'Test User',
        email: 'testuser@mail.com',
        password: 'password123',
    }
    it('should register a new user', async () => {
        const res  = await request(app).post("/api/auth/register")
            .send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message','User Created Successfully 😎');
    });

    it('should login an existing user', async () => {
        const res = await request(app).post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');
    });

    afterAll(async () => {
        // Clean up the test user from the database
        await db.delete(userTable).where(eq(userTable.email, testUser.email));
        await db.$client.end(); // Close the database connection
    })
})
