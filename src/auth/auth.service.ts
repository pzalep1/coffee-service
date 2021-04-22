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
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  /**
   * Strategy used to validate username and password inside local strategy used for local auth guard (login checks).
   * @param email - Email of user trying to login
   * @param pass - Password user trying to login inputs
   * @returns Returns an object with user information (id and email) if the login is sucessful, else returns null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const foundUser = await this.userService.getSingleUser(email);
    if (foundUser) {
      await bcrypt.genSalt(10);
      const isMatch = await bcrypt.compare(pass, foundUser.password);

      if (isMatch) {
        console.log('Passwords Matched');
        const result = { _id: foundUser._id, email: foundUser.email };
        return result;
      } else {
        console.log('Passwords Do not Match!');
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
          priviledgesToAdd = priviledgesToAdd.filter(x => Object.values<string>(Role).includes(x)).filter(
            x => !foundUser.roles.includes(Role[x]),
          );
          console.log(priviledgesToAdd);
          priviledgesToAdd = priviledgesToAdd.concat(foundUser.roles);

          await this.userService.updateSingleUser(user.email, priviledgesToAdd);
          console.log('Added privileges!');
        }
      }
    }
    return null;
  }
}
