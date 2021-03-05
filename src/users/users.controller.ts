import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async register(@Body('user') IUser: any): Promise<string> {
    const token = await this.userService.register(IUser);
    return token;
  }

  @Post('/users/tokens')
  login(): string {
      return 'logged in!'
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
      return 'working token!'
  }

  @Post('/users/:userId/privileges')
  addPrivilege(@Param('userId') userId: string): string {
    return userId;
  }

}