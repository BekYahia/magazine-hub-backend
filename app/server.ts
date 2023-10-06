import { app } from '..'
import { createServer } from 'http'
import config from '../config'

const srv = createServer(app)

export function startServer(): void {
	//to prevent listening on port during testing to avoid 'Port already in use issue'
	if(config.node_env === 'test') return;
	srv.listen(config.port, () => console.log(`Magazine hub - backend listening on port: ${config.port}`))
}

export function closeServer(): void {
	srv.close()
}