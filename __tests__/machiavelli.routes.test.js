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
    MachiavelliGame.create.mockResolvedValue({
      id: 1,
      won: true,
      duration_seconds: 300,
      bot_difficulty: 'medium',
    });

    const res = await request(app)
      .post('/api/v1/machiavelli')
      .send({ won: true, duration_seconds: 300, bot_difficulty: 'medium' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id', 1);
    expect(MachiavelliGame.create).toHaveBeenCalledWith({
      won: true,
      duration_seconds: 300,
      bot_difficulty: 'medium',
    });
  });

  it('POST /api/v1/machiavelli rejects a body without bot_difficulty (400)', async () => {
    const res = await request(app)
      .post('/api/v1/machiavelli')
      .send({ won: true, duration_seconds: 300 });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('GET /api/v1/machiavelli returns paginated history (200)', async () => {
    MachiavelliGame.findAll.mockResolvedValue([
      { id: 2, won: false, duration_seconds: 120, bot_difficulty: 'hard' },
    ]);
    MachiavelliGame.count.mockResolvedValue(1);

    const res = await request(app).get('/api/v1/machiavelli');

    expect(res.status).toBe(200);
    expect(res.body.data.data).toHaveLength(1);
    expect(res.body.data.pagination.total).toBe(1);
  });

  it('GET /api/v1/machiavelli/records returns best winning time per difficulty (200)', async () => {
    MachiavelliGame.findAll.mockResolvedValue([
      { bot_difficulty: 'easy', best_time_seconds: 180 },
      { bot_difficulty: 'medium', best_time_seconds: 240 },
    ]);

    const res = await request(app).get('/api/v1/machiavelli/records');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toMatchObject({ bot_difficulty: 'easy', best_time_seconds: 180 });
  });

  it('GET /api/v1/machiavelli/records returns an empty list when no win exists (200)', async () => {
    MachiavelliGame.findAll.mockResolvedValue([]);

    const res = await request(app).get('/api/v1/machiavelli/records');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
