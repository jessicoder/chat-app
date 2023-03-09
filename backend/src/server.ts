import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import router from './routes/index';

const createServer = async (): Promise<express.Application> => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.disable('x-powered-by');
  app.get('/health', (_req: Request, res: Response) => {
    res.send('OK');
  });
  app.use('/', router);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
  });
  return app;
};

export { createServer };
