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
			title: Joi.string().trim().required(),
			description: Joi.string().trim().required(),
			price: Joi.number().max(9999999999).required(),
			publication_date: Joi.date(),
            is_active: Joi.boolean(),
		})

		const { error } = schema.validate(req.body, { abortEarly: false})
		if (error) return res.status(400).json(error)
		
		next()
	},


	update(req: Request, res: Response, next: NextFunction) {

		const schema = Joi.object({
			id: Joi.number().required(),
			title: Joi.string().trim(),
			description: Joi.string().trim(),
			price: Joi.number().max(9999999999),
			publication_date: Joi.date(),
            is_active: Joi.boolean(),
		})

		const { error } = schema.validate({ ...req.body, ...req.params }, { abortEarly: false })
		if (error) return res.status(400).send(error)

		next()
	},
}