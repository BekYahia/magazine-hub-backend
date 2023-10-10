import User from "../models/user";
import Magazine from "../models/magazine";
import Subscription from "../models/subscription";
import request from "supertest";
import { app } from "..";
import { closeServer } from "../app/server";

describe("Subscriptions API", () => {
	let token = "";

	const user = {
		name: "John Doe",
		email: "j@doe.com",
		password: "1234",
	};
	const magazine = {
		title: "Magazine",
		description: "Magazine description",
		price: 10.0,
		publication_date: new Date(),
		is_active: true,
	};
	const subscription = {
		MagazineId: 1,
		UserId: 1,
		is_active: true,
	};

	afterEach(async () => {
		await Subscription.destroy({ where: {} });
		await User.destroy({ where: {} });
		await Magazine.destroy({ where: {} });
		closeServer();
	});

	beforeAll(async () => {
		const usr = await request(app).post("/api/users").send(user);
		const res = await request(app)
			.post("/api/users/login")
			.send({ email: user.email, password: user.password });
		token = res.header["x-auth-token"];
	});

	describe("POST /api/subscriptions", () => {
		it("Create new subscription", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const res = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			expect(res.status).toBe(201);
			expect(res.body.UserId).toBe(usr.body.id);
			expect(res.body.MagazineId).toBe(mag.body.id);
		});

		it("Shouldn't create new subscription - Invalid user id", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const res = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: random,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body).toBe("No user found with this id");
		});

		it("Shouldn't create new subscription - Invalid Magazine id", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create subscription
			const res = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: random,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body).toBe("No magazine found with this id");
		});

		it("Shouldn't create new subscription - Already have an active subscription to this magazine", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			const subscription = {
				UserId: usr.body.id,
				MagazineId: mag.body.id,
				start_date: new Date(),
				end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
			};
			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send(subscription)
				.set("x-auth-token", token);

			//activate subscription
			await request(app)
				.put(`/api/subscriptions/${sub.body?.id}`)
				.send({ is_active: true })
				.set("x-auth-token", token);

			//try create an other subscription
			const res = await request(app)
				.post("/api/subscriptions")
				.send(subscription)
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body).toBe(
				"You already have an active subscription for this magazine"
			);
		});

		it("Shouldn't create new subscription - missing fields", async () => {
			const res = await request(app)
				.post("/api/subscriptions")
				.send({})
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body._original).toBeTruthy();
		});
	});

	describe("GET /api/subscriptions", () => {
		it("Get all subscriptions - Empty array", async () => {
			const res = await request(app)
				.get("/api/subscriptions")
				.set("x-auth-token", token);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBe(0);
		});

		it("Get all subscriptions - Not Empty array", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			const res = await request(app)
				.get("/api/subscriptions")
				.set("x-auth-token", token);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBe(1);
		});

		it("Get all subscriptions - using filters (ex. where is_active = true)", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			const res = await request(app)
				.get("/api/subscriptions")
				.query({ is_active: true })
				.set("x-auth-token", token);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBe(1);
		});

		it("Get all subscriptions - using invalid filters (ex. is_active = 'IamFilter')", async () => {
			const res = await request(app)
				.get("/api/subscriptions")
				.query({ is_active: 'Hi' })
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body._original).toBeTruthy();
		});
	});

	describe("GET /api/subscriptions/:id", () => {
		it("Get subscription", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//get subscription
			const res = await request(app)
				.get(`/api/subscriptions/${sub.body.id}`)
				.set("x-auth-token", token);

			expect(res.status).toBe(200);
			expect(Number.isNaN(res.body.id)).toBe(false);
		});

		it("Should't get subscription - invalid id (not a number)", async () => {
			const res = await request(app)
				.get("/api/subscriptions/s4")
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body._original.id).toBeTruthy();
		});

		it("Should't get subscription - not found", async () => {
			const random = Math.floor(Math.random() * 10000);
			const res = await request(app)
				.get(`/api/subscriptions/${random}`)
				.set("x-auth-token", token);

			expect(res.status).toBe(404);
			expect(res.body).toBe("No subscription found");
		});
	});

	describe('PUT /api/subscriptions/:id', () => {

		it('Should cancel subscription via update - (Deprecated, use /api/subscriptions/cancel)', async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//cancel subscription
			const res = await request(app)
				.put(`/api/subscriptions/${sub.body.id}`)
				.send({ is_active: false })
				.set("x-auth-token", token);
			
			expect(res.status).toBe(200);
			expect(res.body.is_active).toBe(false);
		})

		it('Shouldn\'t cancel subscription via update - invalid props (is_active si boolean)', async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//cancel subscription
			const res = await request(app)
				.put(`/api/subscriptions/${sub.body.id}`)
				.send({ is_active: 'waa, surprise' })
				.set("x-auth-token", token);
			
			expect(res.status).toBe(400);
			expect(res.body._original).toBeTruthy();
		})

		it('Shouldn\'t cancel subscription with update - no subscription with this id (Deprecated, use /api/subscriptions/cancel)', async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//cancel subscription
			const res = await request(app)
				.put(`/api/subscriptions/${random}`)
				.send({ is_active: false })
				.set("x-auth-token", token);

			expect(res.status).toBe(404);
		})
	});

	describe("POST /api/subscriptions/cancel", () => {
		it("Should cancel subscription", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//cancel subscription
			const res = await request(app)
				.post(`/api/subscriptions/cancel`)
				.send({ UserId: usr.body.id, MagazineId: mag.body.id })
				.set("x-auth-token", token);

			expect(res.body.is_active).toBe(false);
		});

		it("Shouldn\'t cancel subscription - invalid User/Magazine id", async () => {
			//cancel subscription

			const res = await request(app)
				.post(`/api/subscriptions/cancel`)
				.send({ UserId: 'a1', MagazineId: 'a3' })
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body._original).toBeTruthy();
		});
		
		it("Shouldn't cancel subscription - no active subscription to be canceled", async () => {
			const random = Math.floor(Math.random() * 10000);

			//create user
			const usr = await request(app)
				.post("/api/users")
				.send({
					...user,
					email: `j@doe${random}.com`,
				});

			//create magazine
			const mag = await request(app)
				.post("/api/magazines")
				.send({
					...magazine,
					title: `Magazine ${random}`,
				})
				.set("x-auth-token", token);

			//create subscription
			const sub = await request(app)
				.post("/api/subscriptions")
				.send({
					UserId: usr.body.id,
					MagazineId: mag.body.id,
					start_date: new Date(),
					end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				})
				.set("x-auth-token", token);

			//cancel subscription first, to satisfy the condition
			await request(app)
				.post(`/api/subscriptions/cancel`)
				.send({ UserId: usr.body.id, MagazineId: mag.body.id })
				.set("x-auth-token", token);

			//try to cancel subscription
			const res = await request(app)
				.post(`/api/subscriptions/cancel`)
				.send({ UserId: usr.body.id, MagazineId: mag.body.id })
				.set("x-auth-token", token);

			expect(res.status).toBe(400);
			expect(res.body).toBe("you don't have an active subscription");
		});
	});
});
