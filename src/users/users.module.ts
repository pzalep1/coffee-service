import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserSchema } from '../Models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule,
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'frameworkDB'),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}