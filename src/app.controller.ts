import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: 'If the object is unreleased and requester is not the author || If the object is waiting, review, or proofing and the requester is not privileged' })
  @ApiNotFoundResponse({ description: 'User is not found || Learning Object is not found' })
  getHello(): string[] {
    return this.appService.getHello();
  }
}
