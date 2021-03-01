import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  register(@Body('user') IUser: any): any {
    this.userService.register(IUser);
    return 'good to go';
  }

  @Post('/users/tokens')
  login(): string {
      return 'logged in!'
  }

  @Get('/users')
  getAllUsers(): string {
      return 'users!';
  }
  
  @Get('/user/:userId')
  getUser(@Param('userId') userId: string): string {
    return 'user info goes here';
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