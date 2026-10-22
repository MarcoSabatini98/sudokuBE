'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());
jest.mock('../src/models', () => require('./helpers/appMocks').mockCoreModels());

const request = require('supertest');
const app = require('../app');
const { CrosswordPuzzle } = require('../src/models');

describe('GET /api/v1/crossword/generate', () => {
  it('returns 200 with a crossword grid and entries (live fallback)', async () => {
    const res = await request(app).get('/api/v1/crossword/generate?difficulty=easy');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('cells');
    expect(res.body.data).toHaveProperty('entries');
    expect(res.body.data.difficulty).toBe('easy');
    expect(res.body.data.entries.length).toBeGreaterThanOrEqual(5);
  });

  it('serves a pre-generated puzzle when one exists', async () => {
    const payload = { rows: 5, cols: 5, difficulty: 'hard', cells: [], entries: [{ number: 1 }] };
    CrosswordPuzzle.findOne.mockResolvedValueOnce({ payload });

    const res = await request(app).get('/api/v1/crossword/generate?difficulty=hard');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(payload);
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
