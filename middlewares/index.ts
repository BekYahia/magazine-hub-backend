import { Request, Response, NextFunction } from 'express'
import winston from 'winston'
import RequestValidator from './validations'

export function error(err: any, _req: Request, res: Response, _next: NextFunction) {
	winston.error(err.message, err)
	return res.status(500).json('Sorry, Something went wrong!').end()
}

export {RequestValidator}