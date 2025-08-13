import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Submissions moderation e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('user submits team create -> admin approves -> team exists', async () => {
    const server = app.getHttpServer();

    // user register and login
    const email = `user${Date.now()}@example.com`;
    const password = 'Passw0rd!';
    const reg = await request(server).post('/auth/register').send({ email, password, name: 'User', username: `user_${Date.now()}` });
    expect(reg.status).toBe(201);
    const userToken = reg.body.accessToken as string;

    // submit new team creation
    const submissionRes = await request(server)
      .post('/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        targetType: 'TEAM',
        operation: 'CREATE',
        changes: { name: `Test FC ${Date.now()}`, country: 'HU' },
      });
    expect(submissionRes.status).toBe(201);
    const submissionId = submissionRes.body.id as number;

    // admin login
    const login = await request(server)
      .post('/auth/login')
      .send({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!' });
    expect(login.status).toBe(200);
    const adminToken = login.body.accessToken as string;

    // list pending
    const pending = await request(server).get('/submissions/pending').set('Authorization', `Bearer ${adminToken}`);
    expect(pending.status).toBe(200);
    expect(Array.isArray(pending.body)).toBe(true);

    // approve
    const approveRes = await request(server)
      .patch(`/submissions/${submissionId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ comment: 'Looks good' });
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('APPROVED');

    // team appears in list
    const teams = await request(server).get('/teams');
    expect(teams.status).toBe(200);
    const found = (teams.body as any[]).some((t) => typeof t.name === 'string' && t.name.startsWith('Test FC'));
    expect(found).toBe(true);
  });

  it('user submits player create -> admin approves -> player exists', async () => {
    const server = app.getHttpServer();

    // user register and login
    const email = `user${Date.now()}@example.com`;
    const password = 'Passw0rd!';
    const reg = await request(server).post('/auth/register').send({ email, password, name: 'User', username: `user_${Date.now()}` });
    expect(reg.status).toBe(201);
    const userToken = reg.body.accessToken as string;

    // create a team first to attach player
    const adminLogin = await request(server)
      .post('/auth/login')
      .send({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!' });
    const adminToken = adminLogin.body.accessToken as string;
    const team = await request(server).post('/teams').set('Authorization', `Bearer ${adminToken}`).send({ name: `Team X ${Date.now()}`, country: 'HU' });
    expect(team.status).toBe(201);

    // submit player creation
    const submissionRes = await request(server)
      .post('/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        targetType: 'PLAYER',
        operation: 'CREATE',
        changes: { name: `Player ${Date.now()}`, nationality: 'HU', position: 'Forward', teamId: team.body.id },
      });
    expect(submissionRes.status).toBe(201);
    const submissionId = submissionRes.body.id as number;

    // approve
    const approveRes = await request(server)
      .patch(`/submissions/${submissionId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ comment: 'ok' });
    expect(approveRes.status).toBe(200);

    // verify player exists
    const players = await request(server).get('/players');
    expect(players.status).toBe(200);
    const found = (players.body as any[]).some((p) => typeof p.name === 'string' && p.name.startsWith('Player '));
    expect(found).toBe(true);
  });
});


