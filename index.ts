import express from 'express';
const app = express();
import { startServer, router, logging, swagger, events, eventEmitter } from './app';

events();
logging();
router();
startServer();
swagger();

export { app, eventEmitter };