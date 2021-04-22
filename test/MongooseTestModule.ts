import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';

let mongod: MongoMemoryServer;

/**
 * Connect to the in-memory database (essentially mongoose.connect() with options created via async factory function)
 */
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      const mongoUri = await mongod.getUri();
      return {
        uri: mongoUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  await disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
