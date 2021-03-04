import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async register(@Body('user') user: any): Promise<string> {
    const token = await this.userService.register(user);
    return token;
  }

  @Post('/users/tokens')
  async login(@Body('user') user: any): Promise<string> {
    return await this.userService.login(user);
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
