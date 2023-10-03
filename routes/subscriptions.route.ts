import { Router } from 'express'
import SubscriptionController  from '../controllers/subscription.controller'
import { RequestValidator, auth } from '../middlewares'
const validate = RequestValidator.subscriptions
const route = Router()

// Protected Routes
route.all('*', auth) //auth will be required in all below routes
route.get('/', validate.filter, SubscriptionController.all)
route.post('/cancel', validate.cancel, SubscriptionController.cancelSubscription)
route.post('/', validate.create, SubscriptionController.create)
route.get('/:id', validate.id, SubscriptionController.byId)
route.put('/:id', validate.update, SubscriptionController.update)

export = route
