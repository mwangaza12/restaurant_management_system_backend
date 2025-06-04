import request from 'supertest';
import app  from '../src/app';
import db from '../src/drizzle/db';
import { userTable } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';


describe('User API Integration Tests', () => {
    let token: string;
    const testUser = {
        email: 'josepmwangaza1@gmail.com',
        password: '12345678',
    }

    it('should login an existing user', async () => {
            const res = await request(app).post("/api/auth/login")
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('userId');
            token = res.body.token; // Assign the token here
    });

    it('should access protected route with JWT token and return users', async () => {
        const res = await request(app).get('/api/users').set('Authorization', `${token}`);
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await db.$client.end(); // Close the database connection
    })   
});