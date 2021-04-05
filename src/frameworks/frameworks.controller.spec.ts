import { Test, TestingModule } from '@nestjs/testing';
import { FrameworkController } from './frameworks.controller';
import { FrameworkService } from './frameworks.service';

describe('Users', () => {
  let frameworkController: FrameworkController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FrameworkController],
      providers: [FrameworkService],
    }).compile();

    frameworkController = app.get<FrameworkController>(FrameworkController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(2+2).toEqual(4);
    });
  });
});