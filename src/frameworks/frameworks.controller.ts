import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { FrameworkWriteDTO } from '../DTO/frameworkDTO';
import { GuidelineWriteDTO } from '../DTO/guidelineDTO';
import { Framework } from '../Models/framework.schema';
import { Guideline } from '../Models/guideline.schema';
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
  @ApiForbiddenResponse({ description: 'You do not have permission to create a guideline' })
  @ApiNotFoundResponse({ description: 'The specified framework does not exist' })
  @ApiBody({ description: 'Body for a Guideline', type: GuidelineWriteDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @ApiOkResponse({ description: 'OK.' })
  @ApiBadRequestResponse({ description: 'Guideline is not in correct format' })
  @ApiForbiddenResponse({ description: 'You do not have permission to update this guideline' })
  @ApiNotFoundResponse({ description: 'The specified framework or guideline does not exist' })
  @ApiBody({ description: 'Body for a Guideline', type: GuidelineWriteDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @ApiOkResponse({ description: 'Deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Mongo id is not valid' })
  @ApiForbiddenResponse({ description: 'You are not authorized to delete this guideline.' })
  @ApiNotFoundResponse({ description: 'The specified guideline could not be found' })
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
  @ApiOkResponse({ description: 'OK.' })
  @ApiBadRequestResponse({ description: 'FrameworkId or guidelineId is not valid' })
  @ApiForbiddenResponse({ description: 'You are not authorized to see this guideline' })
  @ApiNotFoundResponse({ description: 'The specified guideline could not be found' })
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
  @ApiBadRequestResponse({ description: 'The frameworkId is not valid' })
  @ApiForbiddenResponse({ description: 'You are not authorized to view the guidelines for the framework' })
  @ApiNotFoundResponse({ description: 'The given framework was not found' })
  async getGuidelinesForFramework(
    @Param('frameworkId') frameworkId: string
  ): Promise<Guideline[]> {
        return this.frameworkService.getGuidelinesForFramework({
          frameworkId:frameworkId,
        });
  }

  @Get('/guidelines')
  @ApiOkResponse({ description: 'Everything is A ok' })
  @ApiBadRequestResponse({ description: 'The query is not valid.' })
  async getAllGuidelines(
    @Query() query: any
  ): Promise<Guideline[]> {
        return this.frameworkService.getAllGuidelines({
          query: query,
        });
  }
}