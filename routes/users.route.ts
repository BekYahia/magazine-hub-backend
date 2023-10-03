import { Router } from 'express'
import UserController  from '../controllers/users.controller'
import { RequestValidator } from '../middlewares'
const validate = RequestValidator.users
const route = Router()

route.post('/', validate.create, UserController.create)
route.get('/', UserController.all)
route.get('/:id', validate.id, UserController.byId)
route.put('/:id', validate.update, UserController.update)
route.delete('/:id', validate.id, UserController.delete)

export = route
