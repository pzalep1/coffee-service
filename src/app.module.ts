import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// Added imports
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({isGlobal: true}), 
    MongooseModule.forRoot(process.env.DB_URI, { connectionName: 'frameworkDB', useUnifiedTopology: true, useNewUrlParser: true }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
