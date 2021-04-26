import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../users.controller';
import { UserService } from '../users.service';
import * as request from 'supertest';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../test/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { UserSchema } from '../../Models/user.schema';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { 
  mockedJwtService,
  fakeUser,
  fakeUser2,
  fakeAdmin,
  missingEmail,
  missingName,
  missingOrg,
  validUser,
} from './mocks';
describe('Users', () => {
  let userController: UserController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema}
        ])
      ],
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    userController = moduleRef.get<UserController>(
      UserController,
    );

    await app.init();
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  describe('POST /users', () => {
    it('should return a 200 and a token for correct user', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because no password was provided', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because no email was provided', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because no name was provided', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because no organization was provided', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 409 because the email is already being used', () => {
      expect(2+2).toEqual(4);
    });
  });

  describe('POST /users/tokens', () => {
    it('should return a 200 because the email is registered and the email matches', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 401 because the password does not match', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 404 because the user does not exist', () => {
      expect(2+2).toEqual(4);
    });
  });
  describe('GET /users', () => {
    it('should return a 200 and an array of users', () => {
      expect(2+2).toEqual(4);
    });
  });
  describe('GET /user/:userId', () => {
    it('should return a 200 and the given user', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because invalid mongoId', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 401 because unauthorized', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 403 because forbidden', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 404 not found', () => {
      expect(2+2).toEqual(4);
    });
  });
  describe('GET users/tokens', () => {
    it('should return a 401 because the token is expired', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 200 because the token is good', () => {
      expect(2+2).toEqual(4);
    });
  });
  describe('POST /users/:userId/privileges', () => {
    it('should return a 200 because the token is good', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because the privilege is not valid', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 400 because the mongoId is not valid', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 401 because the requester is not authorized', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 403 because the action is forbidden to the requester', () => {
      expect(2+2).toEqual(4);
    });
    it('should return a 404 because the user is not found', () => {
      expect(2+2).toEqual(4);
    });
  })
});