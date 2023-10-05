import { app } from '..'
import { createServer } from 'http'
import config from '../config'

const srv = createServer(app)

export function startServer(): void {
	srv.listen(config.port, () => {
		console.log(`Magazine hub - backend listening on port: ${config.port}`)
	})
}

export function closeServer(): void {
	srv.close()
}