import express from 'express';
const app = express();
import { startServer, router, logging } from './app';

logging();
router();
startServer();

export { app };