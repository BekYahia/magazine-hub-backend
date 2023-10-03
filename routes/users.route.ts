import { Router } from 'express'
import UserController  from '../controllers/users.controller'
import { RequestValidator, auth } from '../middlewares'
const validate = RequestValidator.users
const route = Router()

// Public Routes
route.post('/', validate.create, UserController.create)
route.post('/login', validate.login, UserController.login)

// Protected Routes
route.all('*', auth) //auth will be required in all below routes
route.get('/', UserController.all)
route.get('/me', UserController.me)
route.get('/:id', validate.id, UserController.byId)
route.put('/:id', validate.update, UserController.update)
route.delete('/:id', validate.id, UserController.delete)

export = route
