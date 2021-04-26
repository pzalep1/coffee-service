import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { User } from '../Models/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async validateUser(user: string, pass: string): Promise<any> {
    const foundUser = await this.userService.getSingleUser(user);

    if (foundUser) {
      await bcrypt.genSalt(10);
      const isMatch = await bcrypt.compare(pass, foundUser.password);

      if (isMatch) {
        const result = { _id: foundUser._id, email: foundUser.email };
        return result;
      } else {
        throw new HttpException('Passwords do not match', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
  }

  async login(user: User): Promise<any> {
    const validUser = await this.validateUser(user.email, user.password);
    // Check that the user has sent up the email and password
    if (validUser) {
      const payload = { email: user.email, _id: user._id, name: user.name };
      return { access_token: this.jwtService.sign(payload, { secret: process.env.SECRET_KEY }) };
    }
  }

  async addPrivilege(user: any, priviledgesToAdd: string[]): Promise<any> {
    if (user && user.email !== undefined && user._id !== undefined) {
      if (priviledgesToAdd !== undefined && priviledgesToAdd.length > 0) {
        const foundUser = await this.userService.getSingleUser(user.email);
        if (foundUser !== undefined) {
          await this.userService.updateSingleUser(user.email, priviledgesToAdd);
        }
      }
    }
    return null;
  }
}
