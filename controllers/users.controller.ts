import { Request, Response } from 'express';
import User from '../models/user'
import { Op } from 'sequelize'

export default {

    async all(req: Request, res: Response) {
		const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['id', 'DESC']] })
		res.send(users)
    },

    async byId(req: Request, res: Response) {
		const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } })
		res.send(user)
    },
	
    async create(req: Request, res: Response) {
		// check if email exist
		const isUser = await User.findOne({ where: { email: req.body.email.toLowerCase() } })
		if (isUser) return res.status(400).json('Email already been used!')

		//save
		const user = await User.create(req.body)
		res.send(user.dropPwd())
    },

   async update(req: any, res: Response) {
	   //is users 
	   let isUser = await User.findByPk(req.params.id)
	   if(!isUser) return res.status(404).json('No user found')

		//check if email associated with another user
		if(req.body.email) {
			const existEmail = await User.findOne({
				where: {
					email: req.body.email.toLowerCase(),
					id: { [Op.ne]: req.params.id }
				}
			})
			if (existEmail) return res.status(400).json('Email already been used!')
		}

		//update
		let user = await User.update(req.body, {
			where: { id: req.params.id },
			individualHooks: true
		})
		//TODO: fix - the return type should be [count, [rows]], i'll check sequelize docs later, sorry ts :)
		//@ts-ignore
		res.json(user[1][0].dropPwd())
    },

	async delete(req: Request, res: Response) {
		const del = await User.destroy({ where: { id: req.params.id } })
		res.send({ del })
	},

}