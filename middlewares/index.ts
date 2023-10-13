import { Request, Response, NextFunction } from 'express'
import winston from 'winston'
import RequestValidator from './validations'
import jwt from 'jsonwebtoken'
import config from '../config'
import { app } from '..'
import { rateLimit } from 'express-rate-limit'
import { rateLimitLogger } from '../app'

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

/**
 * Helmet middleware to enhance security
 */
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

/**
 * Rate limit middleware
 * @description 100 requests per 5 minutes
 */
export const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	limit: config.node_env === 'test' ? 2000 : 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req: Request, res: Response) => {

		// Log the blocked requests
		rateLimitLogger.info({			
			time: new Date().toISOString(),
			ip: req.ip,
			url: `${req.method}: ${req.url}`,
		})

		res.status(429).json({
			error: true,
			message: 'Too many requests, please try again later.',
		});
	},
});

export {RequestValidator}