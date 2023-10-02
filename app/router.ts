import { urlencoded, json } from 'express'
import 'express-async-errors' //catches async errors
import { app } from '..'
import users from '../routes/users.route'
import { error } from '../middlewares'

export function router(): void {

	app.use(urlencoded({ extended: true }))
	app.use(json())

	app.use('/api/users', users)

    app.use(error);
}