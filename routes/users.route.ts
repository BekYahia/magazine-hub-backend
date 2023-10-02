import { Router } from 'express'
import UserController  from '../controllers/users.controller'

const route = Router()

route.get('/', UserController.all)

export = route
