import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';

import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

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

  // We should filter this if the user wants to see all the things
  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  // Used for like profile
  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getSingleUser(userId);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('users/tokens')
  verifyToken(): string {
    return 'working token!';
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/:userId/privileges')
  async addPrivilege(
    @Req() req: any,
    @Body('privileges') privilegesToAdd: string[],
  ): Promise<string> {
    return await this.authService.addPrivilege(req.user, privilegesToAdd);
  }
}


