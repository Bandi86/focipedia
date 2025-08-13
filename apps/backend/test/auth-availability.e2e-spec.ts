import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Auth availability e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports taken flags before/after register', async () => {
    const server = app.getHttpServer();
    const email = `ava${Date.now()}@example.com`;
    const username = `user_${Date.now()}`;

    const ava1 = await request(server).get('/auth/availability').query({ email, username, name: 'John' });
    expect(ava1.status).toBe(200);
    expect(ava1.body.emailTaken).toBe(false);
    expect(ava1.body.usernameTaken).toBe(false);

    const reg = await request(server).post('/auth/register').send({ email, password: 'Passw0rd!', name: 'John', username });
    expect(reg.status).toBe(201);

    const ava2 = await request(server).get('/auth/availability').query({ email, username });
    expect(ava2.status).toBe(200);
    expect(ava2.body.emailTaken).toBe(true);
    expect(ava2.body.usernameTaken).toBe(true);
  });
});


