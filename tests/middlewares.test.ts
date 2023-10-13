import User from '../models/user'
import request from 'supertest'
import { app } from '..'
import { closeServer } from '../app/server'
import { Request, Response, NextFunction } from 'express';
import { error } from '../middlewares';

describe('Middlewares', () => {
    const user = {
        name: 'John Doe',
        email: 'j@doe.com',
        password: '1234',
    }

    afterEach(async () => {
        await User.destroy({ where: {} })
        closeServer()
    });

    describe('Error ', () => {
        it('Should return 500 if an error occurs', async () => {
            const mockRequest = {} as Request
            const mockNext = {} as NextFunction
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                end: jest.fn().mockReturnThis(),
            } as unknown as Response
        
            // Create a test error
            const testError = new Error('Test error')
        
            // Call the error function
            error(testError, mockRequest, mockResponse, mockNext)
            expect(mockResponse.status).toHaveBeenCalledWith(500)
            expect(mockResponse.json).toHaveBeenCalledWith('Sorry, Something went wrong!')
            expect(mockResponse.end).toHaveBeenCalled()
        });
    });

    describe('Auth ', () => {
        it('Should reject unauthorized access - No token provided', async () => {
            //try to list users without a token
            const res = await request(app).get('/api/users')

            expect(res.status).toBe(401)
            expect(res.body).toBe('Access denied, no provided token!')
        });

        it('Should reject unauthorized access - Provide an invalid token', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('x-auth-token', 'esto es un token invalido') // :)

            expect(res.status).toBe(400)
            expect(res.body).toBe('Invalid token!')
        });

        it('Should allow access to authorized users', async () => {
            //randomize the email to avoid conflict
            const random = Math.floor(Math.random() * 1000)
            user.email = `j@doe${random}.com`

            //create a user and login
            await request(app).post('/api/users').send(user);
            const login = await request(app)
                .post('/api/users/login')
                .send({ email: user.email, password: user.password })

            //list users a token
            const res = await request(app)
                .get('/api/users')
                .set('x-auth-token', login.header['x-auth-token'])

            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
        });
    });

    describe('Admin ', () => {
        it('Should reject unauthorized access from non-admin users', async () => {
            //randomize the email to avoid conflict
            const random = Math.floor(Math.random() * 1000)
            user.email = `j@doe${random}.com`

            const usr = await request(app).post('/api/users').send(user);
            const login = await request(app)
                .post('/api/users/login')
                .send({ email: user.email, password: user.password })

            //access secret area
            const res = await request(app)
                .get('/api/users/secret-area')
                .set('x-auth-token', login.header['x-auth-token'])

            expect(res.status).toBe(403)
            expect(res.body).toBe('Access denied, admins only!')
        });

        it('Should authorize access to users with admin role', async () => {
            //randomize the email to avoid conflict
            const random = Math.floor(Math.random() * 1000)
            user.email = `j@doe${random}.com`

            //create a user and login
            await request(app).post('/api/users').send({
                ...user,
                role: 'admin'
            });
            const login = await request(app)
                .post('/api/users/login')
                .send({ email: user.email, password: user.password })

            //access secret area
            const res = await request(app)
                .get('/api/users/secret-area')
                .set('x-auth-token', login.header['x-auth-token'])

            expect(res.status).toBe(200)
            expect(res.body).toBe('Welcome to the secret area!')
        });
    });

});
