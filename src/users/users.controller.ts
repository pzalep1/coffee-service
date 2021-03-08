import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/users')
  async register(@Body('user') user: any): Promise<string> {
    const token = await this.userService.register(user);
    return token;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/users/tokens')
  async login(@Request() req): Promise<any> {
    return await this.authService.login(req.user);
  }

  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getSingleUser(userId);
  }

  @Get('users/tokens')
  verifyToken(): string {
    return 'working token!';
  }

  @Post('/users/:userId/privileges')
  addPrivilege(@Param('userId') userId: string): string {
    return userId;
  }
}
