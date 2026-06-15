'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());
jest.mock('../src/models', () => require('./helpers/appMocks').mockCoreModels());

const request = require('supertest');
const app = require('../app');

describe('GET /api/v1/crossword/generate', () => {
  it('returns 200 with a crossword grid and entries', async () => {
    const res = await request(app).get('/api/v1/crossword/generate?difficulty=easy');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('cells');
    expect(res.body.data).toHaveProperty('entries');
    expect(res.body.data.difficulty).toBe('easy');
    expect(res.body.data.entries.length).toBeGreaterThanOrEqual(5);
  });

  it('defaults to medium when difficulty is missing', async () => {
    const res = await request(app).get('/api/v1/crossword/generate');
    expect(res.status).toBe(200);
    expect(res.body.data.difficulty).toBe('medium');
  });

  it('returns 400 for an invalid difficulty', async () => {
    const res = await request(app).get('/api/v1/crossword/generate?difficulty=impossible');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});
