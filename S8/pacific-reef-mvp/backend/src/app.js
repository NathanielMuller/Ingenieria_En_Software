import express from 'express';
import path from 'path';
import { apiRouter } from './routes/index.js';
import { env } from './config/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);
  app.use(express.static(env.staticDir));

  app.get('/', (request, response) => {
    response.sendFile(path.join(env.staticDir, 'index.html'));
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}