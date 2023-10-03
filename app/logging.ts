import winston from 'winston'
import config from '../config'

export function logging(): void {

	//Store logs in a file
	winston.add(new winston.transports.File({
		level: 'error',
		filename: 'logger.log',
		handleExceptions: true,
	}))
    //Fancy logging on terminal
	winston.add(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize({ all: true }),
			winston.format.simple()
		),
		level: 'silly',
		handleExceptions: true,
	}))

	// Check JWT key
	if(!config.jwt_key) new Error ('Please Set a JWT key in you environment.')	

	// Handle uncaughtException
	process.on("uncaughtException", ex => {
		winston.error(ex.message, ex)
		setTimeout(() => process.exit(1), 1000)
	})

	// Handle unhandledRejection
	process.on("unhandledRejection", rej => { throw rej })
}