import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

export = {

	id(req: Request, res: Response, next: NextFunction) {

		const schema = Joi.object({ id: Joi.number() })

		const { error } = schema.validate(req.params)
		if (error) return res.status(400).send(error)

		next()
	},


	create(req: Request, res: Response, next: NextFunction) {

		const schema = Joi.object({
			UserId: Joi.number().required(),
			MagazineId: Joi.number().required(),
			start_date: Joi.date().required(),
			end_date: Joi.date().required(),
            // is_active: Joi.boolean().required(),
            // payment_status: Joi.string().trim(),
		})

		const { error } = schema.validate(req.body, { abortEarly: false})
		if (error) return res.status(400).json(error)
		
		next()
	},

	update(req: Request, res: Response, next: NextFunction) {
        
		const schema = Joi.object({
            id: Joi.number().required(),
			start_date: Joi.date(),
			end_date: Joi.date(),
            is_active: Joi.boolean(),
		})

		const { error } = schema.validate({ ...req.body, ...req.params }, { abortEarly: false })
		if (error) return res.status(400).send(error)
        
		next()
	},


    cancel(req: Request, res: Response, next: NextFunction) {

        const schema = Joi.object({
            UserId: Joi.number().required(),
            MagazineId: Joi.number().required(),
        })

        const { error } = schema.validate({ ...req.body, ...req.params }, { abortEarly: false })
        if (error) return res.status(400).send(error)

        next()
    },

	filter(req: Request, res: Response, next: NextFunction) {

		const schema = Joi.object({
			UserId: Joi.number(),
			MagazineId: Joi.number(),
			start_date: Joi.date(),
			end_date: Joi.date(),
            is_active: Joi.boolean(),
            payment_status: Joi.string().trim(),
		})

		const { error } = schema.validate(req.query, { abortEarly: false })
		if (error) return res.status(400).json(error)
		
		next()
	},
}