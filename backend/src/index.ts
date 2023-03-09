import { createServer } from './server';
import * as config from './config/config';
import initMongoDB from './database/mongo';
import { errorHandler } from './middlewares/errorHandler';
import http from 'http';
import { SocketServer } from './socket';

const serverConfig: config.ServerConfig = config.getServerConfig();
const mongoConfig: config.MongoConfig = config.getMongoConfig();
const host = serverConfig.HOST;
const port = serverConfig.PORT;

const startServer = async () => {
  await initMongoDB(mongoConfig);
  const app = await createServer();
  const httpServer = http.createServer(app);
  new SocketServer(httpServer);
  httpServer.listen(port, host, () => {
    console.log(`Server started at address ${host}:${port}`);
  });
};

process.on('unhandledRejection', (reason: Error | any) => {
  console.log(`Unhandled Rejection: ${reason.message || reason}`);
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  console.log(`uncaughtException: ${error.message}`);
  errorHandler.handleError(error);
});

startServer();
