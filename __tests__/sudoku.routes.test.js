'use strict';

jest.mock('../src/config/db', () => ({
  authenticate: jest.fn().mockResolvedValue(),
  define: jest.fn(),
}));

jest.mock('../src/models', () => ({
  sequelize: { transaction: jest.fn(), authenticate: jest.fn() },
  Game: { findAll: jest.fn(), create: jest.fn(), hasOne: jest.fn() },
  Record: { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn(), belongsTo: jest.fn() },
}));

const request = require('supertest');
const app = require('../app');

describe('GET /api/v1/sudoku/generate', () => {
  it('returns 200 with puzzle and solution for difficulty=easy', async () => {
    const res = await request(app).get('/api/v1/sudoku/generate?difficulty=easy');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('puzzle');
    expect(res.body.data).toHaveProperty('solution');
    expect(res.body.data.puzzle).toHaveLength(9);
    expect(res.body.data.solution).toHaveLength(9);
  });

  it('returns 400 for invalid difficulty', async () => {
    const res = await request(app).get('/api/v1/sudoku/generate?difficulty=impossible');

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('defaults to easy when difficulty is missing', async () => {
    const res = await request(app).get('/api/v1/sudoku/generate');

    expect(res.status).toBe(200);
    expect(res.body.data.difficulty).toBe('easy');
  });
});
