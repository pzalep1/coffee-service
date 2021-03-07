import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Models/user.schema';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async register(user: User): Promise<string> {
    // Check that user is valid
    if (
      user &&
      user.email !== undefined &&
      user.password !== undefined &&
      user.organization !== undefined &&
      user.name !== undefined
    ) {
      // Check that user email is not already in use
      const email = user.email;
      const found = await this.userModel.findOne({ email }).exec();
      console.log(found);
      if (!found) {
        // Salt password
        const saltRounds = 10;
        const password = user.password;
        const hash = await bcrypt.hash(password, saltRounds);
        user.password = hash;
        const userDoc = new this.userModel({
          ...user,
          _id: new Types.ObjectId(),
        });
        await userDoc.save();
        this.login(user);
      } else {
        throw new HttpException('Email already in use!', HttpStatus.CONFLICT);
      }
    } else {
      throw new HttpException(
        'Body must contain email, password, organization, and name',
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'yee';
  }

  async login(user: User): Promise<any> {
    // Check that the user has sent up the email and password
    if (user && user.email !== undefined && user.password !== undefined) {
      // Check that the user exists
      const email = user.email;
      const password = user.password;
      const foundUser = await this.userModel.findOne({ email }).exec();

      // Check that password match
      if (foundUser) {
        const hash = foundUser.password;
        await bcrypt.genSalt(10);
        const isMatch = await bcrypt.compare(password, hash);

        if (isMatch) {
          console.log('Passwords Matched');
          // Generate token (jwt or passport*)
          // return the token to get returned to the client
          const payload = { name: foundUser.name, sub: foundUser._id };
          return { access_token: this.jwtService.sign(payload) };
        } else {
          console.log('Problem');
          throw new HttpException(
            'Password inputted does not match records',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return 'nope';
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getSingleUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
}
