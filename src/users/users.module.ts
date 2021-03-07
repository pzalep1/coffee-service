import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { jwtConstants } from './constants';
import { UserSchema } from '../Models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      ConfigModule,
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'frameworkDB'),
      JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: {expiresIn:'60s'},
      }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtModule],
})
export class UsersModule {}