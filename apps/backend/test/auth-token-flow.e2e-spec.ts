import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Auth token flow e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register -> login -> protected -> refresh -> protected -> logout', async () => {
    const server = app.getHttpServer();
    const email = `tok${Date.now()}@example.com`;
    const username = `tok_${Date.now()}`;

    // register
    const reg = await request(server).post('/auth/register').send({ email, password: 'Passw0rd!', name: 'Tok User', username });
    expect(reg.status).toBe(201);

    // login
    const login = await request(server).post('/auth/login').send({ email, password: 'Passw0rd!' });
    expect(login.status).toBe(200);
    const access = login.body.accessToken as string;
    const refresh = login.body.refreshToken as string;
    expect(access).toBeDefined();
    expect(refresh).toBeDefined();

    // protected
    const usersForbidden = await request(server).get('/users');
    expect(usersForbidden.status).toBe(401);
    const usersAdminDenied = await request(server).get('/users').set('Authorization', `Bearer ${access}`);
    // regular user should be forbidden to admin-only list
    expect([401, 403]).toContain(usersAdminDenied.status);

    // refresh
    const ref = await request(server).post('/auth/refresh').send({ refreshToken: refresh });
    expect(ref.status).toBe(200);
    const access2 = ref.body.accessToken as string;
    expect(access2).toBeDefined();

    // logout
    const logout = await request(server).delete('/auth/logout').set('Authorization', `Bearer ${access2}`);
    expect(logout.status).toBe(204);
  });
});


