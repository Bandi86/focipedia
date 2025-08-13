import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Basic leagues/seasons/matches flow e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('admin creates league/teams/match and fetches with public endpoints', async () => {
    const server = app.getHttpServer();

    // Admin login
    const login = await request(server)
      .post('/auth/login')
      .send({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!' });
    expect(login.status).toBe(200);
    const adminToken = login.body.accessToken as string;

    // Create league
    const league = await request(server)
      .post('/leagues')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `Test League ${Date.now()}`, country: 'HU' });
    expect(league.status).toBe(201);
    const leagueId = league.body.id as number;

    // Create teams
    const teamA = await request(server).post('/teams').set('Authorization', `Bearer ${adminToken}`).send({ name: `Team A ${Date.now()}`, country: 'HU' });
    const teamB = await request(server).post('/teams').set('Authorization', `Bearer ${adminToken}`).send({ name: `Team B ${Date.now()}`, country: 'HU' });
    expect(teamA.status).toBe(201);
    expect(teamB.status).toBe(201);

    // Create match
    const matchDate = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const matchRes = await request(server)
      .post('/matches')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ leagueId, homeTeamId: teamA.body.id, awayTeamId: teamB.body.id, matchDate, status: 'Scheduled' });
    expect(matchRes.status).toBe(201);

    // Public upcoming should include
    const upcoming = await request(server).get('/matches/upcoming');
    expect(upcoming.status).toBe(200);
    expect(Array.isArray(upcoming.body)).toBe(true);
  });
});


