import { Test, TestingModule } from '@nestjs/testing';
import { FrameworkController } from './frameworks.controller';
import { FrameworkService } from './frameworks.service';

import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../test/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { FrameworkWriteDTO } from '../DTO/frameworkDTO';
import { FrameworkSchema } from '../Models/framework.schema';
import { GuidelineSchema } from '../Models/guideline.schema';
import { Types } from 'mongoose';

import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GuidelineWriteDTO } from '../DTO/guidelineDTO';

// Declare a test suite on Frameworks.
describe('Frameworks', () => {
  let frameworkController: FrameworkController;
  let frameworkService: FrameworkService;
  let app: INestApplication;

  beforeEach(async () => {
    // Creates as mock module with dependencies just as how the app is bootstrapped in main.ts.
    // Test module provides application execution context to mock full Nest runtime.
    const moduleRef: TestingModule = await Test.createTestingModule({
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

    app = moduleRef.createNestApplication();

    frameworkService = moduleRef.get<FrameworkService>(FrameworkService);
    frameworkController = moduleRef.get<FrameworkController>(
      FrameworkController,
    );

    await app.init();
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(frameworkController).toBeDefined();
  });

  function bIsMatchingFramework(
    res: any,
    index = 0,
    name = 'Test Name',
    author = 'Zi',
    year = '2020', // Frameworks must be between 1998 and 2020
    levels = ['college'],
  ) {
    if (res) {
      const body = res.body;
      if (body) {
        const framework = body[index];
        for (let level of levels) {
          if (framework && !framework.levels.includes(level)) {
            throw new Error(
              'Framework missing level: ' +
                level +
                '\n' +
                JSON.stringify(framework),
            );
          }
        }
        if (
          framework && (
          framework.name !== name ||
          framework.author !== author ||
          framework.year !== year)
        ) {
          throw new Error(
            "Framework doesn't match\n" + JSON.stringify(framework),
          );
        }
      }
    } else {
      throw new Error('Request not properly formatted');
    }
  }

  function createMockFrameworkDTO(
    name = 'Test Framework Name',
    author = 'Zi',
    year = '2020', // Frameworks must be between 1998 and 2020
    levels = ['college'],
  ) {
    let mockFrameworkDTO = new FrameworkWriteDTO();
    mockFrameworkDTO.name = name;
    mockFrameworkDTO.author = author;
    mockFrameworkDTO.year = year;
    mockFrameworkDTO.levels = levels;
    return mockFrameworkDTO;
  }

  function createMockGuidelineDTO(
    name = 'Test Guideline Name',
    guidelineText = 'Lalalala',
  ) {
    let guidelineWriteDTO = new GuidelineWriteDTO();
    guidelineWriteDTO.name = name;
    guidelineWriteDTO.guidelineText = guidelineText;
    return guidelineWriteDTO;
  }

  async function createMockFramework(
    name = 'Test Name',
    author = 'Zi',
    year = '2020', // Frameworks must be between 1998 and 2020
    levels = ['college'],
  ): Promise<string> {
    let mockFrameworkDTO = createMockFrameworkDTO(name, author, year, levels);

    const newFrameworkId = await frameworkService.createFramework({
      framework: mockFrameworkDTO,
    });

    return newFrameworkId;
  }

  async function createMockFrameworkFromDTO(DTO: FrameworkWriteDTO): Promise<string> {
    let mockFrameworkDTO = createMockFrameworkDTO(
      DTO.name,
      DTO.author,
      DTO.year,
      DTO.levels,
    );

    const newFrameworkId = await frameworkService.createFramework({
      framework: mockFrameworkDTO,
    });

    return newFrameworkId;
  }

  async function createMockGuidelineFromDTO(
    frameworkId: string,
    DTO: GuidelineWriteDTO,
  ): Promise<string> {
    let mockGuidelineDTO = createMockGuidelineDTO(DTO.name, DTO.guidelineText);

    const newGuidelineId = await frameworkService.createGuideline({
      frameworkId: frameworkId,
      guideline: mockGuidelineDTO,
    });

    return newGuidelineId;
  }

  // Since several tests rely on this, we'll test this as well.
  it('createframework', async () => {
    const newFrameworkId = await createMockFramework();

    expect(newFrameworkId).toBeTruthy();

    const framework = frameworkService.getSingleFramework({
      frameworkId: newFrameworkId,
    });
    expect(framework).toBeTruthy();
    await expect(
      frameworkService.getSingleFramework({
        frameworkId: Types.ObjectId().toHexString(),
      }),
    ).rejects.toThrow(Error);
  });

  it('/GET frameworks', async () => {
    const newFrameworkId = await createMockFramework();
    const framework = frameworkService.getSingleFramework({
      frameworkId: newFrameworkId,
    });
    expect(framework).toBeTruthy();

    await request(app.getHttpServer())
      .get('/frameworks')
      .expect(200)
      .expect(res => {
        bIsMatchingFramework(res);
      });

    await request(app.getHttpServer())
      .get('/frameworks')
      .query({ name: 'Zi' })
      .expect(200)
      .expect(res => {
        bIsMatchingFramework(res, 1, 'Test', 'Zi');
        bIsMatchingFramework(res, 2, 'Test2', 'Zi');
      });
  });

  it('/POST frameworks', async () => {
    const successfulRes = await request(app.getHttpServer())
      .post('/frameworks')
      .send({ framework: createMockFrameworkDTO() })
      .set('Accept', 'application/json')
      .expect(201);

    let x = await frameworkService.getSingleFramework({
      frameworkId: successfulRes.body,
    });
    expect(x).toBeTruthy();

    const invalidValueRes = await request(app.getHttpServer())
      .post('/frameworks')
      .send({ framework: createMockFrameworkDTO('') })
      .set('Accept', 'application/json')
      .expect(400);

    const missingFieldRes = await request(app.getHttpServer())
      .post('/frameworks')
      .send({ framework: { name: 'Wee' } })
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('/PATCH frameworks/:frameworks', async () => {
    const newFrameworkId = await createMockFramework();

    const successfulRes = await request(app.getHttpServer())
      .patch('/frameworks/' + newFrameworkId)
      .send({
        framework: createMockFrameworkDTO('Cyphina', 'Wee', '2021'),
      })
      .set('Accept', 'application/json')
      .expect(200);

    let x = await frameworkService.getSingleFramework({
      frameworkId: newFrameworkId,
    });

    expect(x.name).toEqual('Cyphina');
    expect(x.author).toEqual('Wee');
    expect(x.year).toEqual('2021');

    const invalidFieldRes = await request(app.getHttpServer())
      .patch('/frameworks/' + newFrameworkId)
      .send({
        framework: { name: 'Cyphina' },
      })
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('/GET frameworks/:frameworkId', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO('Pie', 'Ki', 'Wee');
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);

    const successfulRes = await request(app.getHttpServer())
      .get('/frameworks/' + newFrameworkId)
      .expect(200);

    const resBody = successfulRes.body;

    expect(resBody.name).toEqual(mockFrameworkDTO.name);
    expect(resBody.author).toEqual(mockFrameworkDTO.author);
    expect(resBody.year).toEqual(mockFrameworkDTO.year);
  });

  it('/POST frameworks/:frameworkId/guidelines', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);
    const mockGuidelineDTO = createMockGuidelineDTO();

    const successfulRes = await request(app.getHttpServer())
      .post('/frameworks/' + newFrameworkId + '/guidelines')
      .send({
        guideline: mockGuidelineDTO,
      })
      .set('Accept', 'application/json')
      .expect(201);

    const guidelineId = successfulRes.body;

    let guideline = await frameworkService.getSingleGuideline({
      frameworkId: newFrameworkId,
      guidelineId: guidelineId,
    });

    expect(guideline.name).toEqual(mockGuidelineDTO.name);
    expect(guideline.guidelineText).toEqual(mockGuidelineDTO.guidelineText);
  });

  it('/GET frameworks/:frameworkId/guidelines/', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);

    const mockGuidelineDTO = createMockGuidelineDTO();
    const mockGuidelineDTO2 = createMockGuidelineDTO(
      'Guidelines Name: Nub',
      'Guideline Text: Pie',
    );

    const successfulRes = await request(app.getHttpServer())
      .get('/frameworks/' + newFrameworkId + '/guidelines')
      .set('Accept', 'application/json')
      .expect(200);

  });

  it('/PATCH frameworks/:frameworkId/guidelines/:guidelineId', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);
    const mockGuidelineDTO = createMockGuidelineDTO();
    const mockGuidelineId = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO,
    );
    const updateGuidelineDTO = createMockGuidelineDTO(
      'NewName',
      'NewDescription',
    );

    const successfulRes = await request(app.getHttpServer())
      .patch('/frameworks/' + newFrameworkId + '/guidelines/' + mockGuidelineId)
      .send({
        guideline: updateGuidelineDTO,
      })
      .set('Accept', 'application/json')
      .expect(200);

    let guideline = await frameworkService.getSingleGuideline({
      frameworkId: newFrameworkId,
      guidelineId: mockGuidelineId,
    });

    expect(guideline.name).toEqual(updateGuidelineDTO.name);
    expect(guideline.guidelineText).toEqual(updateGuidelineDTO.guidelineText);
  });

  it('/DELETE frameworks/:frameworkId/guidelines/:guidelineId', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);
    const mockGuidelineDTO = createMockGuidelineDTO();
    const mockGuidelineId = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO,
    );

    const successfulRes = await request(app.getHttpServer())
      .delete(
        '/frameworks/' + newFrameworkId + '/guidelines/' + mockGuidelineId,
      )
      .expect(200);

    await expect(
      frameworkService.getSingleGuideline({
        frameworkId: newFrameworkId,
        guidelineId: mockGuidelineId,
      }),
    ).rejects.toThrow(Error);
  });

  it('/GET frameworks/:frameworkId/guidelines/:guidelineId', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);
    const mockGuidelineDTO = createMockGuidelineDTO();
    const mockGuidelineId = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO,
    );

    const successfulRes = await request(app.getHttpServer())
      .get('/frameworks/' + newFrameworkId + '/guidelines/' + mockGuidelineId)
      .expect(200);

    const guideline = successfulRes.body;

    expect(guideline.name).toEqual(mockGuidelineDTO.name);
    expect(guideline.guidelineText).toEqual(mockGuidelineDTO.guidelineText);
  });

  it('/GET guidelines', async () => {
    const mockFrameworkDTO = createMockFrameworkDTO();
    const newFrameworkId = await createMockFrameworkFromDTO(mockFrameworkDTO);
    const mockGuidelineDTO = createMockGuidelineDTO('wee');
    const mockGuidelineDTO2 = createMockGuidelineDTO('wee', 'pee');
    const mockGuidelineDTO3 = createMockGuidelineDTO('wee', 'jee');

    const mockGuidelineId = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO,
    );

    const mockGuidelineId2 = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO2,
    );

    const mockGuidelineId3 = await createMockGuidelineFromDTO(
      newFrameworkId,
      mockGuidelineDTO3,
    );

    const successfulRes = await request(app.getHttpServer())
      .get('/guidelines')
      .query({ name: 'wee' })
      .expect(200);

    let guidelines = successfulRes.body;

    expect(guidelines.length).toEqual(3);
    for (let guideline of guidelines) {
      expect(guideline.name).toEqual(mockGuidelineDTO.name);
    }

    const successfulResFilteredGT = await request(app.getHttpServer())
      .get('/guidelines')
      .query({ guidelineText: 'pee' })
      .expect(200);
  });
});
