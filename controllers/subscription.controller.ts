import { Request, Response } from 'express';
import Subscription from '../models/subscription'
import User from '../models/user'
import Magazine from '../models/magazine'

export default {

    async all(req: Request, res: Response) {
        
        const where = req.query

        const magazines = await Subscription.findAll({ order: [['id', 'DESC']], include: [
            { model: User, attributes: ['id', 'name', 'email'] },
            { model: Magazine, attributes: ['id', 'title', 'is_active'] },
        ],
        where,
    })
        res.send(magazines)
    },

    async byId(req: Request, res: Response) {
		const magazine = await Subscription.findByPk(req.params.id)
		res.send(magazine)
    },
	
    async create(req: Request, res: Response) {
		// is active subscription
		const isSubscription = await Subscription.findOne({ where: {
            UserId: req.body.UserId,
            MagazineId: req.body.MagazineId,
            is_active: true,
        }})
		if (isSubscription) return res.status(400).json('You already have an active subscription for this magazine')

		//save
		const magazine = await Subscription.create(req.body)

        //payment with stripe
            //- success? update {payment_status: 'paid', is_active: true}
            //- notify user via email

		res.send(magazine)
    },

   async update(req: any, res: Response) {
	   //is valid subscription
	   let isSubscription = await Subscription.findByPk(req.params.id)
	   if(!isSubscription) return res.status(404).json('No subscription found')

		//update
		let magazine = await Subscription.update(req.body, {
			where: { id: req.params.id },
			individualHooks: true
		})
		//@ts-ignore
		res.json(magazine[1][0])
    },

    async cancelSubscription(req: any, res: Response) {
	   //is active subscription
       const isSubscription = await Subscription.findOne({ where: {
            UserId: req.body.UserId,
            MagazineId: req.body.MagazineId,
            is_active: true,
        }})
       if(!isSubscription) return res.status(400).json('you don\'t have an active subscription')

		//update
		let magazine = await Subscription.update({ is_active: false }, {
			where: { id: req.params.id },
			individualHooks: true
		})
		//@ts-ignore
		res.json(magazine[1][0])        
    },

}