import { Router } from 'express'
import MagazineController  from '../controllers/magazines.controller'
import { RequestValidator, auth } from '../middlewares'
const validate = RequestValidator.magazines
const route = Router()

// Protected Routes
route.all('*', auth) //auth will be required in all below routes
route.get('/', MagazineController.all)
route.post('/', validate.create, MagazineController.create)
route.get('/:id', validate.id, MagazineController.byId)
route.put('/:id', validate.update, MagazineController.update)
route.delete('/:id/perm-delete', validate.id, MagazineController.permanentlyDelete)
route.delete('/:id', validate.id, MagazineController.softDelete)

export = route
