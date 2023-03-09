import * as dotenv from 'dotenv';

export interface ServerConfig {
  HOST: string;
  PORT: number;
}

export interface MongoConfig {
  MONGO_URI: string;
}

const env = process.env.ENV || 'local';
console.log(`Loading configuration of ${env} env`);
const result: dotenv.DotenvConfigOutput = dotenv.config({
  path: `./env/${env}.env`,
});

if (result.error) {
  console.error(`[error] Fail to load env vars of ${env} env`);
  throw result.error;
}

const getServerConfig = (): ServerConfig => {
  return {
    HOST: process.env.HOST || '0.0.0.0',
    PORT: Number(process.env.PORT) || 3000,
  };
};

const getMongoConfig = (): MongoConfig => {
  return {
    MONGO_URI:
      process.env.MONGO_URI || 'mongodb://host.docker.internal:27017/chat-app',
  };
};

export { getMongoConfig, getServerConfig };
