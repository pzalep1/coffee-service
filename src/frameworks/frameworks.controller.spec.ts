import { Test, TestingModule } from '@nestjs/testing';
import { FrameworkController } from './frameworks.controller';
import { FrameworkService } from './frameworks.service';

import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../test/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { FrameworkWriteDTO } from '../DTO/frameworkDTO';
import { Framework, FrameworkSchema } from '../Models/framework.schema';
import { Guideline, GuidelineSchema } from '../Models/guideline.schema';

import { getModelToken } from '@nestjs/mongoose';
import { FrameworkModule } from './frameworks.module';
import { Types } from 'mongoose';

// Declare a test suite on Frameworks.
describe('Frameworks', () => {
  let frameworkController: FrameworkController;
  let frameworkService: FrameworkService;

  beforeEach(async () => {
    // Creates as mock module with dependencies just as how the app is bootstrapped in main.ts.
    // Test module provides application execution context to mock full Nest runtime.
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Framework', schema: FrameworkSchema },
        ]),
        MongooseModule.forFeature([
          { name: 'Guideline', schema: GuidelineSchema },
        ]),
      ],
      controllers: [FrameworkController],
      providers: [FrameworkService],
    }).compile();

    frameworkService = app.get<FrameworkService>(FrameworkService);
    frameworkController = app.get<FrameworkController>(FrameworkController);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(frameworkController).toBeDefined();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(2 + 2).toEqual(4);
    });
  });

  it('createframework', async () => {
    let mockFrameworkDTO = new FrameworkWriteDTO();
    mockFrameworkDTO.name = 'Canned Food Making Objectives';
    mockFrameworkDTO.author = 'Cyphina';
    mockFrameworkDTO.year = '2022';
    mockFrameworkDTO.levels = ['college'];
    const newFrameworkId = await frameworkService.createFramework({
      framework: mockFrameworkDTO,
    });
    const framework1 = await frameworkService.getSingleFramework({
      frameworkId: newFrameworkId,
    });
    try {
      const framework2 = await frameworkService.getSingleFramework({
        frameworkId: Types.ObjectId().toHexString(),
      });
    } catch (e) {
      expect(framework1).toBeDefined();
      expect(e).toBeDefined();
    }
  });
});
