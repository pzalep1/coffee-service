import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FrameworkController } from './../src/frameworks/frameworks.controller';
import { FrameworkService } from './../src/frameworks/frameworks.service';

describe('Framework Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [FrameworkController],
      providers: [FrameworkService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });
});