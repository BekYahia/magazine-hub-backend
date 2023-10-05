import User from '../models/user'
import Magazine from '../models/magazine'
import request from 'supertest'
import { app } from '..'
import { closeServer } from '../app/server'

describe('Magazines API', () => {
    let token = ''

    afterEach(async () => {
        await User.destroy({ where: {} })
        await Magazine.destroy({ where: {} })
        closeServer()
    })

    const user = {
        name: 'John Doe',
        email: "j@doe.com",
        password: "1234"
    }

    const magazine = {
        title: 'Magazine',
        description: 'Magazine description',
        price: 10.00,
        publication_date: new Date(),
        is_active: true,
    }

    describe('POST /api/users/magazines', () => {

        it('login successfully, to use it the other requests', async () => {
            const usr = await request(app).post('/api/users').send(user)
            const res = await request(app).post('/api/users/login').send({ email: 'j@doe.com', password: '1234' })

            token = res.header['x-auth-token']

            expect(res.status).toBe(200)
            expect(res.header['x-auth-token']).toBeTruthy()
        })
    })

	describe('POST /api/magazines', () => {

		it('create new magazine', async () => {
			const res = await request(app).post('/api/magazines').send(magazine)

			expect(res.status).toBe(200)
			expect(res.body.title).toBe(magazine.title)
		})

		it('shouldn\'t create new magazine, title already used', async () => {

			await request(app).post('/api/magazines').send(magazine)
			const res = await request(app).post('/api/magazines').send(magazine)

			expect(res.status).toBe(400)
			expect(res.body).toBe('Title already been used!')
		})

		it('shouldn\'t create new magazine, missing fields', async () => {
			const res = await request(app).post('/api/magazines').send({})
			expect(res.status).toBe(400)
			expect(res.body._original).toBeTruthy()
		})
	})

	describe('GET /api/magazines', () => {
		it('get all magazines', async () => {
			const res = await request(app).get('/api/magazines').set('x-auth-token', token)
			expect(res.status).toBe(200)
			expect(Array.isArray(res.body)).toBe(true)
		})
	})


	describe('GET /api/magazines/:id', () => {

		it('get magazine', async () => {

			//create magazine
			const mag = await request(app).post('/api/magazines').send(magazine)

			//get user data
			const res = await request(app).get(`/api/magazines/${mag.body.id}`).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.title).toBe(magazine.title)
		})

		it('should\'t get magazine, invalid id', async () => {
			const res = await request(app).get('/api/magazines/m4').set('x-auth-token', token)
			expect(res.status).toBe(400)
			expect(res.body._original.id).toBe('m4')
		})
	})


	describe('PUT /api/magazines/:id', () => {

		it('update magazine', async () => {
			const mag = await request(app).post('/api/magazines').send(user)
			const res = await request(app).put(`/api/magazines/${mag.body.id}`).send({ title: 'new title', description: 'new des' }).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.title).toBe('new title')
		})

		it('shouldn\'t update magazine, no magazine with this ID', async () => {
			const mag = await request(app).post('/api/magazines').send(magazine)
			const res = await request(app).put('/api/magazines/5').send({ tile: 'new title' }).set('x-auth-token', token)

			expect(res.status).toBe(404)
			expect(res.body).toBe('No magazine found')
		})

		it('shouldn\'t update magazine, title already used', async () => {
			const magazine2 = {
				name: 'title 2',
			}
			const mag = await request(app).post('/api/magazines').send(magazine)
			const mag2 = await request(app).post('/api/magazines').send(magazine2)
			const res = await request(app).put(`/api/magazines/${mag.body.id}`).send({ title: 'title 2' }).set('x-auth-token', token)

			expect(res.status).toBe(400)
			expect(res.body).toBe('Title already been used!')
		})

		it('should\'t update magazine, no data provided', async () => {
			const mag = await request(app).post('/api/magazines').send(magazine)
			const res = await request(app).put(`/api/magazines/${mag.body.id}`).send({}).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.title).toBe(magazine.title)
		})

		it('should\'t update magazine, invalid fields', async () => {
			const mag = await request(app).post('/api/magazines').send(magazine)
			const res = await request(app).put(`/api/magazines/${mag.body.id}`).send({ price: 'ten' }).set('x-auth-token', token)

			expect(res.status).toBe(400)
			expect(res.body._original).toBeTruthy()
		})

		it('should\'t update magazine, invalid id', async () => {
			const res = await request(app).put('/api/magazines/a4').send({ title: 'new title' }).set('x-auth-token', token)
			expect(res.status).toBe(400)
			expect(res.body._original.id).toBe('a4')
		})
	})


	describe('DELETE /api/magazines/:id', () => {

		it('soft delete magazine', async () => {
			const usr = await request(app).post('/api/magazines').send(magazine)
			const res = await request(app).delete(`/api/magazines/${usr.body.id}`).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.del).toBe(1)
		})

		it('should\'t delete magazine, invalid id', async () => {
			const res = await request(app).delete('/api/magazines/a4').set('x-auth-token', token)
			expect(res.status).toBe(400)
			expect(res.body._original.id).toBe('a4')
		})
	})

});