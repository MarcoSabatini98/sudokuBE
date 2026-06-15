'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());

jest.mock('../src/models', () => ({
  sequelize: { transaction: jest.fn(), authenticate: jest.fn() },
  MachiavelliGame: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../app');
const { MachiavelliGame } = require('../src/models');

describe('Machiavelli routes', () => {
  it('POST /api/v1/machiavelli saves a result (201)', async () => {
    MachiavelliGame.create.mockResolvedValue({ id: 1, won: true, duration_seconds: 300 });

    const res = await request(app)
      .post('/api/v1/machiavelli')
      .send({ won: true, duration_seconds: 300 });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id', 1);
    expect(MachiavelliGame.create).toHaveBeenCalledWith({ won: true, duration_seconds: 300 });
  });

  it('POST /api/v1/machiavelli rejects an invalid body (400)', async () => {
    const res = await request(app).post('/api/v1/machiavelli').send({ won: true });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('GET /api/v1/machiavelli/records returns the best winning time (200)', async () => {
    MachiavelliGame.findOne.mockResolvedValue({ id: 5, won: true, duration_seconds: 240 });

    const res = await request(app).get('/api/v1/machiavelli/records');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.best_time_seconds).toBe(240);
  });

  it('GET /api/v1/machiavelli/records returns null when no win exists (200)', async () => {
    MachiavelliGame.findOne.mockResolvedValue(null);

    const res = await request(app).get('/api/v1/machiavelli/records');

    expect(res.status).toBe(200);
    expect(res.body.data.best_time_seconds).toBeNull();
  });
});
