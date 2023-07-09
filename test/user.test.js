import request from 'supertest';
import app from "../server.js"
import expect from "expect";

describe('User Controller', () => {
    describe('POST /register', () => {
        it('should register a new user', async () => {
            const newUser = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser',
                profile: 'Test profile',
            };

            const response = await request(app)
                .post('/register')
                .send(newUser)
                .expect(201);

            // Assert the response
            expect(response.body.message).toBe('User successfully registered');
            expect(response.body.data.email).toBe(newUser.email);
            expect(response.body.data.username).toBe(newUser.username);
            // Add more assertions as needed
        });

        it('should return an error if the email already exists', async () => {
            // Create a user with the existing email first

            const existingUser = {
                email: 'test@example.com',
                password: 'existingpassword',
                username: 'existinguser',
            };

            await request(app).post('/register').send(existingUser).expect(201);

            // Attempt to register a new user with the same email

            const newUser = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser',
                profile: 'Test profile',
            };

            const response = await request(app)
                .post('/register')
                .send(newUser)
                .expect(400);

            // Assert the response
            expect(response.body.error).toBe('Email already exists');
            // Add more assertions as needed
        });

        // Add more test cases for different scenarios
    });

    // Add more describe blocks for other endpoints

    // Example:
    // describe('GET /users', () => {
    //   it('should return all users', async () => {
    //     // ...
    //   });
    // });

    // Example:
    // describe('GET /users/:id', () => {
    //   it('should return a user by ID', async () => {
    //     // ...
    //   });
    // });

    // ...
});
