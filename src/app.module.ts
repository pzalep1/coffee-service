import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// Added imports
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({isGlobal: true}), 
    MongooseModule.forRoot('mongodb://localhost/nest', { connectionName: 'frameworkDB', useUnifiedTopology: true, useNewUrlParser: true }), AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
