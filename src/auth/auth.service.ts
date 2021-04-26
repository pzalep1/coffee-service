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
    if (user) {
      await bcrypt.genSalt(10);
      const isMatch = await bcrypt.compare(pass, foundUser.password);

      if (isMatch) {
        const result = { _id: foundUser._id, email: foundUser.email };
        return result;
      } else {
        throw new HttpException('Passwords do not match', HttpStatus.UNAUTHORIZED);
      }
    }
    return null;
  }

  async login(user: User): Promise<any> {
    // Check that the user has sent up the email and password
    if (user && user.email !== undefined && user._id !== undefined) {
      const payload = { email: user.email, _id: user._id };
      return { access_token: this.jwtService.sign(payload) };
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
