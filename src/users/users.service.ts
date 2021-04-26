import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Models/user.schema';
import { UserWriteDTO } from '../DTO/userWriteDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async register(user: UserWriteDTO): Promise<any> {
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
      } else {
        throw new HttpException('Email already in use!', HttpStatus.CONFLICT);
      }
    } else {
      throw new HttpException(
        'Body must contain email, password, organization, and name',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getSingleUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).select("-password").exec();
  }

  async updateSingleUser(email: string, roles: string[]) {
    await this.userModel.updateOne({ email }, { roles }).exec();
  }
}
