import * as mongoose from 'mongoose';
import { MongoConfig } from '../config/config';

const initMongoDB = async (config: MongoConfig) => {
  mongoose.set(
    'debug',
    (collection: string, method: string, ...args: any[]) => {
      console.log(
        `[mongo]: operation=[${collection}.${method}]`,
        `arguments=${JSON.stringify(args)}`,
      );
    },
  );

  await mongoose.connect(config.MONGO_URI);

  // let mongoConn: mongoose.Connection = mongoose.connection;

  // mongoConn.on("error", () => {
  //   console.error(`Error while connecting to database: ${config.MONGO_URI}`);
  // });

  // mongoConn.on("open", () => {
  //   console.log(`Connect to database ${config.MONGO_URI} successully`);
  // });
};

export default initMongoDB;
