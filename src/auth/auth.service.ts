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
        console.log('Passwords Matched');
        const result = { _id: foundUser._id, name: foundUser.name };
        return result;
      }
    }
    return null;
  }

  async login(user: User): Promise<any> {
    // Check that the user has sent up the email and password
    if (user && user.name !== undefined && user._id !== undefined) {
      const payload = { name: user.name, sub: user._id };
      return { access_token: this.jwtService.sign(payload) };
    }
  }
}

// Authorization header
// React app handles storing the token

// Encoding token body with user object
// Setup strategies for admin and regular user and authentication guard the routes
