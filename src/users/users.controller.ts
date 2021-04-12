import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Req,
  UseGuards,
} from '@nestjs/common';

import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserWriteDTO } from 'src/DTO/userWriteDTO';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/users')
  @ApiOperation({summary: "Register User"})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ description: 'User Registration', type: UserWriteDTO })
  async register(@Body('user') user: any): Promise<string> {
    const token = await this.userService.register(user);
    return token;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/users/tokens')
  @ApiOperation({summary: "Login"})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: 'User Login' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  async login(@Request() req): Promise<any> {
    return await this.authService.login(req.user);
  }

  // We should filter this if the user wants to see all the things
  @Get('/users')
  @ApiOperation({summary: "List all User Resources"})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  // Used for like profile
  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  @ApiOperation({summary: "Get Information about a User"})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getSingleUser(userId);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('users/tokens')
  @ApiOperation({summary: "Not sure what this does..."})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  verifyToken(): string {
    return 'working token!';
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('/users/:userId/privileges')
  @ApiOperation({summary: "Admin can add a privilege to a user"})
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ description: 'Add various privileges to user'})
  async addPrivilege(
    @Param('email') userToAddPrivilegeEmail: string,
    @Body('privileges') privilegesToAdd: string[],
  ): Promise<string> {
    return await this.authService.addPrivilege(
      userToAddPrivilegeEmail,
      privilegesToAdd,
    );
  }
}
