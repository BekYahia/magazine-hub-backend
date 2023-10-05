import express from 'express';
const app = express();
import { startServer, router, logging, swagger } from './app';

logging();
router();
startServer();
swagger();

export { app };