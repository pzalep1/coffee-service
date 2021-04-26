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
import { JwtModule, JwtService } from '@nestjs/jwt';
import { 
  mockedJwtService,
  fakeUser,
  fakeUser2,
  fakeAdmin,
  missingEmail,
  missingPassword,
  missingName,
  missingOrg,
  validUser,
  validUserLogin,
  invalidUserLogin,
  unregisteredUser
} from './mocks';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
describe('Users', () => {
  let userController: UserController;
  let app: INestApplication;
  let userId;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema}
        ]),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
          signOptions: { expiresIn: '84000000s' },
        }),
        ConfigModule.forRoot({isGlobal: true}),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
        PassportModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    userController = moduleRef.get<UserController>(
      UserController,
    );

    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('POST /users', () => {
    it('should return a 200 for a correctly sent user object', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: validUser})
      .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      done();
    });
    it('should return a 400 because no password was provided', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: missingPassword })
      .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      done();
    });
    it('should return a 400 because no email was provided', async(done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: missingEmail })
      .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      done();
    });
    it('should return a 400 because no name was provided', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: missingName })
      .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      done();
    });
    it('should return a 400 because no organization was provided', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: missingOrg })
      .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      done();
    });
    it('should return a 409 because the email is already being used', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: validUser })
      .set('Accept', 'application/json');

      expect(res.status).toBe(409);
      done();
    });
  });

  describe('POST /users/tokens', () => {
    it('should return a 200 because the email is registered and the email matches', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users/tokens')
      .send({ user: validUserLogin })
      .set('Accept', 'application/json');

      expect(res).toBe(201);
      done();
    });
    it('should return a 401 because the password does not match', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users/tokens')
      .send({ user: invalidUserLogin })
      .set('Accept', 'application/json');

      expect(res.status).toBe(401);
      done();
    });
    it('should return a 404 because the user does not exist', async (done) => {
      const res = await request(app.getHttpServer())
      .post('/users/tokens')
      .send({ user: unregisteredUser })
      .set('Accept', 'application/json');

      expect(res.status).toBe(404);
      done();
    });
  });
  describe('GET /users', () => {
    it('should return a 200 and an array of users', async (done) => {
      const res = await request(app.getHttpServer())
      .get('/users')
      .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      userId = res.body[0];
      done();
    });
  });
  // describe('GET /users/:userId', () => {
  //   it('should return a 200 and the given user', async (done) => {
  //     const route = '/users/'+ userId
  //     const res = await request(app.getHttpServer())
  //     .get(route)
  //     .set('Accept', 'application/json');

  //     expect(res.status).toBe(200);
  //     expect(route).toBeNull();
  //     done();
  //   });
    // it('should return a 400 because invalid mongoId', async (done) => {
    //   expect(2+2).toEqual(4);
    //   const res = await request(app.getHttpServer())
    //   .get('/users/12345')
    //   .set('Accept', 'application/json');
      
    //   expect(res.status).toBe(400);
    //   done();
    // });
    // it('should return a 401 because unauthorized', async (done) => {
    //   expect(2+2).toEqual(4);
    //   done();
    // });
    // it('should return a 403 because forbidden', async (done) => {
    //   expect(2+2).toEqual(4);
    //   done();
    // });
    // it('should return a 404 not found', async (done) => {
    //   expect(2+2).toEqual(4);
    //   done();
    // });
  //});
  // describe('GET users/tokens', () => {
  //   it('should return a 401 because the token is expired', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 200 because the token is good', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  // });
  // describe('POST /users/:userId/privileges', () => {
  //   it('should return a 200 because the token is good', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 400 because the privilege is not valid', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 400 because the mongoId is not valid', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 401 because the requester is not authorized', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 403 because the action is forbidden to the requester', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  //   it('should return a 404 because the user is not found', async (done) => {
  //     expect(2+2).toEqual(4);
  //     done();
  //   });
  // })
});