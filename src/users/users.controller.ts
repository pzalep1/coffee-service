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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { User } from 'src/Models/user.schema';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserWriteDTO } from '../DTO/userWriteDTO';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/users')
  @ApiOperation({ summary: 'Register User' })
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ description: 'User Registration', type: UserWriteDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body('user') user: UserWriteDTO): Promise<string> {
    const token = await this.userService.register(user);
    return token;
  }

  @Post('/users/tokens')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: 'User Login' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async login(@Body('user') user: any): Promise<any> {
    return await this.authService.login(user);
  }

  // We should filter this if the user wants to see all the things
  @Get('/users')
  @ApiOperation({ summary: 'List all User Resources' })
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();
    return users;
  }

  // Used for profiles
  @UseGuards(JwtAuthGuard)
  @Get('/users/:userId')
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async getUser(@Param('userId') userId: string): Promise<any> {
    let userValid = await this.userService.getUserById(userId);
    return {_id: userValid._id, name: userValid.name, email: userValid.email, roles: userValid.roles, organization: userValid.organization};
  }

  // Token refresh route
  @UseGuards(JwtAuthGuard)
  @Get('users/tokens')
  @ApiOperation({ summary: 'Not sure what this does...' })
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({})
  async verifyToken(@Request() req): Promise<any> {
    return req.user;
  }

  // TODO: Use query parameter insted of modifying self.
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/users/:userId/privileges')
  @ApiOperation({ summary: 'Admin can add a privilege to a user' })
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ description: 'Add various privileges to user' })
  async addPrivilege(
    @Req() req: any,
    @Body('privileges') privilegesToAdd: string[],
  ): Promise<string> {
    return await this.authService.addPrivilege(req.user, privilegesToAdd);
  }
}
