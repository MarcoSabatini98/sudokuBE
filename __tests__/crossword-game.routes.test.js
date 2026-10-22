'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());
jest.mock('../src/models', () => require('./helpers/appMocks').mockCoreModels());

const request = require('supertest');
const app = require('../app');
const { CrosswordGame } = require('../src/models');

describe('Crossword game routes', () => {
  it('POST /api/v1/crossword/games saves a completion (201)', async () => {
    CrosswordGame.create.mockResolvedValue({ id: 1, difficulty: 'easy', time_seconds: 200 });

    const res = await request(app)
      .post('/api/v1/crossword/games')
      .send({ difficulty: 'easy', time_seconds: 200 });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id', 1);
    expect(CrosswordGame.create).toHaveBeenCalledWith({ difficulty: 'easy', time_seconds: 200 });
  });

  it('POST /api/v1/crossword/games rejects an invalid body (400)', async () => {
    const res = await request(app).post('/api/v1/crossword/games').send({ difficulty: 'easy' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('GET /api/v1/crossword/records returns the best time per difficulty (200)', async () => {
    CrosswordGame.findAll.mockResolvedValue([{ difficulty: 'easy', best_time_seconds: 120 }]);

    const res = await request(app).get('/api/v1/crossword/records');

    expect(res.status).toBe(200);
    expect(res.body.data[0].best_time_seconds).toBe(120);
  });

  it('GET /api/v1/crossword/games returns a paginated list (200)', async () => {
    CrosswordGame.findAll.mockResolvedValue([{ id: 1, difficulty: 'easy', time_seconds: 200 }]);
    CrosswordGame.count.mockResolvedValue(1);

    const res = await request(app).get('/api/v1/crossword/games?difficulty=easy');

    expect(res.status).toBe(200);
    expect(res.body.data.pagination.total).toBe(1);
  });
});
