import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register, login, refresh, access admin, logout', async () => {
    const server = app.getHttpServer();

    // register new user
    const email = `test${Date.now()}@example.com`;
    const password = 'Passw0rd!';
    const reg = await request(server).post('/auth/register').send({ email, password, name: 'T', username: `t_${Date.now()}` });
    expect(reg.status).toBe(201);
    expect(reg.body.accessToken).toBeDefined();
    expect(reg.body.refreshToken).toBeDefined();

    // login with admin seed
    const login = await request(server)
      .post('/auth/login')
      .send({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!' });
    expect(login.status).toBe(200);
    const adminAccess = login.body.accessToken as string;
    const adminRefresh = login.body.refreshToken as string;

    // access admin-only endpoint
    const usersRes = await request(server).get('/users').set('Authorization', `Bearer ${adminAccess}`);
    expect(usersRes.status).toBe(200);
    expect(Array.isArray(usersRes.body)).toBe(true);

    // refresh token
    const refreshRes = await request(server).post('/auth/refresh').send({ refreshToken: adminRefresh });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.body.refreshToken).toBeDefined();

    // logout
    const logoutRes = await request(server)
      .delete('/auth/logout')
      .set('Authorization', `Bearer ${refreshRes.body.accessToken}`);
    expect(logoutRes.status).toBe(204);
  });
});


