import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { FrameworkWriteDTO } from 'src/DTO/frameworkDTO';
import { GuidelineWriteDTO } from 'src/DTO/guidelineDTO';
import { Framework } from 'src/Models/framework.schema';
import { Guideline } from 'src/Models/guideline.schema';
import { FrameworkService } from './frameworks.service';
@Controller()
export class FrameworkController {
  constructor(private readonly frameworkService: FrameworkService) {}

  @Post('/frameworks')
  @ApiOkResponse({ description: 'Framework Created!' })
  @ApiBadRequestResponse({ description: 'Invalid name, year, or author for framework' })
  @ApiBody({ description: 'Body for a framework', type: FrameworkWriteDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createFramework(@Body('framework') framework: FrameworkWriteDTO): Promise<void> {
    return this.frameworkService.createFramework({
        framework: framework
    });
  }

  @Patch('/frameworks/:frameworkId')
  @ApiOkResponse({ description: 'Framework Updated!' })
  @ApiBadRequestResponse({ description: 'Invalid updates for framework' })
  @ApiForbiddenResponse({ description: 'You are not permitted to update frameworks.' })
  @ApiNotFoundResponse({ description: 'The specified framework was not found.' })
  @ApiBody({ description: 'Body for a partial framework', type: FrameworkWriteDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateFramework(
    @Param('frameworkId') frameworkId: string, 
    @Body('framework') frameworkUpdates: Partial<Framework>
  ): Promise<void> {
    return this.frameworkService.updateFramework({
        frameworkId: frameworkId,
        frameworkUpdates: frameworkUpdates
    });
  }

  @Get('/frameworks')
  @ApiOkResponse({ description: 'OK.' })
  @ApiBadRequestResponse({ description: 'Framework query invalid' })
  async getFrameworks(
    @Query() query: any
  ): Promise<Framework[]> {
        return this.frameworkService.getFrameworks({
          query: query
        });
  }

  @Get('/frameworks/:frameworkId')
  @ApiOkResponse({ description: 'OK.' })
  @ApiBadRequestResponse({ description: 'The specified ID is not valid' })
  @ApiForbiddenResponse({ description: 'You do not have access to the given framework' })
  @ApiNotFoundResponse({ description: 'The specified framework was not found' })
  async getSingleFramework(
    @Param('frameworkId') frameworkId: string
  ): Promise<Framework> {
        return this.frameworkService.getSingleFramework({
          frameworkId: frameworkId
        });
  }

  @Post('/frameworks/:frameworkId/guidelines')
  @ApiOkResponse({ description: 'Guideline created!' })
  @ApiBadRequestResponse({ description: 'Guideline is not in the correct format' })
  @ApiForbiddenResponse({ description: 'You do not have permission to access the specified framework' })
  @ApiNotFoundResponse({ description: 'The specified framework does not exists' })
  @ApiBody({ description: 'Body for a partial framework', type: GuidelineWriteDTO })
  async createGuideline(
    @Param('frameworkId') frameworkId: string, 
    @Body('guideline') guideline: GuidelineWriteDTO
  ): Promise<void> {
        return this.frameworkService.createGuideline({
          frameworkId: frameworkId, 
          guideline: guideline
        });
  }

  @Patch('/frameworks/:frameworkId/guidelines/:guidelineId')
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async updateGuideline(
    @Param('frameworkId') frameworkId: string,
    @Param('guidelineId') guidelineId: string,
    @Body('guideline') guideline: any
  ): Promise<void> {
        return this.frameworkService.updateGuideline({
          frameworkId: frameworkId, 
          guidelineId: guidelineId, 
          guideline: guideline
        });
  }

  @Delete('/frameworks/:frameworkId/guidelines/:guidelineId')
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async deleteGuideline(
    @Param('frameworkId') frameworkId: string, 
    @Param('guidelineId') guidelineId: string
  ): Promise<void> {
        return this.frameworkService.deleteGuideline({
          frameworkId: frameworkId, 
          guidelineId: guidelineId
        });
  }

  @Get('/frameworks/:framework/guidelines/:guidelineId')
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async getSingleGuideline(
    @Param('frameworkId') frameworkId: string, 
    @Param('guidelineId') guidelineId: string
  ): Promise<Guideline> {
        return this.frameworkService.getSingleGuideline({
          frameworkId: frameworkId,
          guidelineId: guidelineId
        });
  }

  @Get('/frameworks/:frameworkId/guidelines')
  @ApiOkResponse({ description: 'Welcome to the coffee-service API' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  @ApiBody({ })
  async getGuidelinesForFramework(
    @Param('frameworkId') frameworkId: string
  ): Promise<Guideline[]> {
        return this.frameworkService.getGuidelinesForFramework({
          frameworkId:frameworkId,
        });
  }

  @Get('/guidelines')
  @ApiOkResponse({ description: 'Everything is A ok' })
  @ApiBadRequestResponse({ description: 'Swagger not working right' })
  @ApiForbiddenResponse({ description: '' })
  async getAllGuidelines(
    @Query() query: any
  ): Promise<Guideline[]> {
        return this.frameworkService.getAllGuidelines({
          query: query,
        });
  }
}