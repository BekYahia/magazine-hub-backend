import { Request, Response, NextFunction } from 'express'
import winston from 'winston'
import RequestValidator from './validations'
import jwt from 'jsonwebtoken'
import config from '../config'
import { app } from '..'

export function error(err: any, _req: Request, res: Response, _next: NextFunction) {
	winston.error(err.message, err)
	return res.status(500).json('Sorry, Something went wrong!').end()
}

export function auth(req: any, res: Response, next: NextFunction) {
	const token = req.header('x-auth-token')
	if (!token) return res.status(401).json('Access denied, no provided token!')

	try {
		const decoded = jwt.verify(token, config.jwt_key as string)
		req.user = decoded
		next()
	} catch (ex) {
		res.status(400).json('Invalid token!')
	}
}

export function admin(req: any, res: Response, next: NextFunction) {
	if (req.user.role !== 'admin') return res.status(403).json('Access denied, admins only!')
	next()
}

export function helmet(req: Request, res: Response, next: NextFunction) {
	const HEADERS = {
		"Content-Security-Policy":
		"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cross-Origin-Resource-Policy": "same-origin",
		"Origin-Agent-Cluster": "?1",
		"Referrer-Policy": "no-referrer",
		"Strict-Transport-Security": "max-age=15552000; includeSubDomains",
		"X-Content-Type-Options": "nosniff",
		"X-DNS-Prefetch-Control": "off",
		"X-Download-Options": "noopen",
		"X-Frame-Options": "SAMEORIGIN",
		"X-Permitted-Cross-Domain-Policies": "none",
		"X-XSS-Protection": "0",
	}
	res.set(HEADERS)
	app.disable('x-powered-by')
	next()
}

export {RequestValidator}