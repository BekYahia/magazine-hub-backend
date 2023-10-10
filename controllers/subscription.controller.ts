import { Request, Response } from 'express';
import Subscription from '../models/subscription'
import User from '../models/user'
import Magazine from '../models/magazine'
import { eventEmitter } from '..'

export default {

    async all(req: Request, res: Response) {

        //parse boolean
        const where = req.query
        if (where?.is_active !== undefined) where.is_active = JSON.parse(where.is_active as string)

        const subscription = await Subscription.findAll({
            order: [['id', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Magazine, attributes: ['id', 'title', 'is_active'] },
            ],
            where,
        })
        res.send(subscription)
    },

    async byId(req: Request, res: Response) {
        const subscription = await Subscription.findByPk(req.params.id)
        if (!subscription) return res.status(404).json('No subscription found')
        res.send(subscription)
    },

    async create(req: Request, res: Response) {

        // check if user exist
        const isUser = await User.findByPk(req.body.UserId)
        if (!isUser) return res.status(400).json('No user found with this id')

        // check if magazine exist
        const isMagazine = await Magazine.findByPk(req.body.MagazineId)
        if (!isMagazine) return res.status(400).json('No magazine found with this id')

        // is active subscription
        const isSubscription = await Subscription.findOne({
            where: {
                UserId: req.body.UserId,
                MagazineId: req.body.MagazineId,
                is_active: true,
            }
        })
        if (isSubscription) return res.status(400).json('You already have an active subscription for this magazine')

        /**
         * In a real world scenario, use stripe or any other payment gateway to process the payment
         * and update the subscription status accordingly
        */
        //Simulate payment, then update
        req.body.payment_status = 'succeeded'
        req.body.is_active = true
        req.body.start_date = new Date()
        req.body.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1))
        //end simulation

        //save
        const subscription = await Subscription.create(req.body)
        
        //email the user
        eventEmitter.emit('notifications:subscription_created', subscription)

        res.status(201).send(subscription)
    },

    async update(req: any, res: Response) {
        //is valid subscription
        let isSubscription = await Subscription.findByPk(req.params.id)
        if (!isSubscription) return res.status(404).json('No subscription found')

        //update
        let subscription = await Subscription.update(req.body, {
            where: { id: req.params.id },
            individualHooks: true
        })
        //@ts-ignore
        res.json(subscription[1][0])
    },

    async cancelSubscription(req: any, res: Response) {
        //is active subscription
        const isSubscription = await Subscription.findOne({
            where: {
                UserId: req.body.UserId,
                MagazineId: req.body.MagazineId,
                is_active: true,
            }
        })
        if (!isSubscription) return res.status(400).json('you don\'t have an active subscription')

        //update
        let subscription = await Subscription.update({ is_active: false }, {
            where: { id: isSubscription.id },
            individualHooks: true
        })
        //@ts-ignore
        res.json(subscription[1][0])
    },

}