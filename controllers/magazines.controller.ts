import { Request, Response } from 'express';
import Magazine from '../models/magazine'
import { Op } from 'sequelize'

export default {

	async all(req: Request, res: Response) {
		const magazines = await Magazine.findAll({ order: [['id', 'DESC']] })
		res.send(magazines)
	},

    async byId(req: Request, res: Response) {
		const magazine = await Magazine.findByPk(req.params.id)
		res.send(magazine)
    },
	
    async create(req: Request, res: Response) {
		// check if title exist
		const isMagazine = await Magazine.findOne({ where: { title: req.body.title.toLowerCase() } })
		if (isMagazine) return res.status(400).json('Title already been used!')

		//save
		const magazine = await Magazine.create(req.body)
		res.send(magazine)
    },

   async update(req: any, res: Response) {
	   //is valid magazine?
	   let isMagazine = await Magazine.findByPk(req.params.id)
	   if(!isMagazine) return res.status(404).json('No magazine found')

		//check if title used by another magazine
		if(req.body.title) {
			const existTitle = await Magazine.findOne({
				where: {
					title: req.body.title.toLowerCase(),
					id: { [Op.ne]: req.params.id }
				}
			})
			if (existTitle) return res.status(400).json('Title already been used!')
		}

		//update
		let magazine = await Magazine.update(req.body, {
			where: { id: req.params.id },
			individualHooks: true
		})
		//TODO: fix - the return type should be [count, [rows]], i'll check sequelize docs later, sorry ts :)
		//@ts-ignore
		res.json(magazine[1][0])
    },

	async softDelete(req: Request, res: Response) {
		const del = await Magazine.update({ is_active: false }, {
			where: { id: req.params.id },
			individualHooks: true
		})
		//@ts-ignore
        res.send(del[1][0])
	},

	async delete(req: Request, res: Response) {
		const del = await Magazine.destroy({ where: { id: req.params.id } })
		res.send({ del })
	},

}