import User from '../models/user'
import Magazine from '../models/magazine'
import Subscription from '../models/subscription'
import request from 'supertest'
import { app } from '..'
import { closeServer } from '../app/server'

describe('Subscriptions API', () => {
    let token = ''
    let userId = 0
    let magazineId = 0

    afterEach(async () => {
        await User.destroy({ where: {} })
        await Magazine.destroy({ where: {} })
        await Subscription.destroy({ where: {} })
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
    const subscription = {
        MagazineId: 1,
        UserId: 1,
        is_active: true,
    }

    describe('POST Prep user nad magazine', () => {

        it('login successfully, to use it the other requests', async () => {
            const usr = await request(app).post('/api/users').send(user)
            const res = await request(app).post('/api/users/login').send({ email: user.email, password: user.password })

            token = res.header['x-auth-token']
            userId = usr.body.id
            expect(res.status).toBe(200)
            expect(res.header['x-auth-token']).toBeTruthy()
        })

		it('create new magazine', async () => {
			const res = await request(app).post('/api/magazines').send(magazine)
            magazineId = res.body.id
			expect(res.status).toBe(200)
			expect(res.body.title).toBe(magazine.title)
		})
    })

	describe('POST /api/subscriptions', () => {

		it('create new subscription', async () => {
			const res = await request(app).post('/api/subscriptions').send(subscription)

			expect(res.status).toBe(200)
			expect(res.body.MagazineId).toBe(subscription.MagazineId)
		})


		it('shouldn\'t create new subscription, missing fields', async () => {
			const res = await request(app).post('/api/subscriptions').send({})
			expect(res.status).toBe(400)
			expect(res.body._original).toBeTruthy()
		})

		it('shouldn\'t create new subscription, you already have an active subscriptions', async () => {

            //check if have a subscription with same user_id and magazine_id and is_active = true
			const res = await request(app).post('/api/subscriptions').send(subscription) //same subscription
			expect(res.status).toBe(400)
			expect(res.body._original).toBeTruthy()
		})
	})

	describe('GET /api/subscriptions', () => {
		it('get all subscriptions', async () => {
			const res = await request(app).get('/api/subscriptions').set('x-auth-token', token)
			expect(res.status).toBe(200)
			expect(Array.isArray(res.body)).toBe(true)
		})
	})


	describe('GET /api/subscriptions/:id', () => {

		it('get subscription', async () => {

			//create subscription
			const sub = await request(app).post('/api/subscriptions').send(subscription)

			//get user data
			const res = await request(app).get(`/api/subscriptions/${sub.body.id}`).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.MagazineId).toBe(subscription.MagazineId)
		})

		it('should\'t get subscription, invalid id', async () => {
			const res = await request(app).get('/api/subscriptions/s4').set('x-auth-token', token)
			expect(res.status).toBe(400)
			expect(res.body._original.id).toBe('s4')
		})
	})

    describe('POST /api/subscriptions/cancel', () => {
		it('cancel subscription', async () => {
			const sub = await request(app).post('/api/subscriptions').send(subscription)
			const res = await request(app).post(`/api/subscriptions/cancel`).send({ is_active: false, UserId: userId, MagazineId: magazineId }).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.is_active).toBe(false)
		})

		// it('shouldn\'t cancel subscription, no subscription with this ID', async () => {
		// 	const sub = await request(app).post('/api/subscriptions').send(subscription)
		// 	const res = await request(app).post('/api/subscriptions/cancel').send({ is_active: false }).set('x-auth-token', token)

		// 	expect(res.status).toBe(404)
		// 	expect(res.body).toBe('No subscription found')
		// })

		it('shouldn\'t cancel subscription, no active subscription to be canceled', async () => {
			const subscription2 = {
				...subscription,
                is_active: false,
			}
			const sub = await request(app).post('/api/subscriptions').send(subscription2)
			const res = await request(app).post(`/api/subscriptions/cancel`).send({ is_active: false, UserId: subscription.UserId, MagazineId: subscription.MagazineId }).set('x-auth-token', token)

			expect(res.status).toBe(400)
		})
    })


	describe('DELETE /api/subscriptions/:id', () => {

		it('soft delete subscription', async () => {
			const sub = await request(app).post('/api/subscriptions').send(subscription)
			const res = await request(app).delete(`/api/subscriptions/${sub.body.id}`).set('x-auth-token', token)

			expect(res.status).toBe(200)
			expect(res.body.del).toBe(1)
		})

		it('should\'t delete subscription, invalid id', async () => {
			const res = await request(app).delete('/api/subscriptions/a4').set('x-auth-token', token)
			expect(res.status).toBe(400)
			expect(res.body._original.id).toBe('a4')
		})
	})


});
