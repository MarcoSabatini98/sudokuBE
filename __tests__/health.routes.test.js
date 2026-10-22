'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());
jest.mock('../src/models', () => require('./helpers/appMocks').mockCoreModels());

const request = require('supertest');
const app = require('../app');

describe('GET /api/v1/health', () => {
  it('returns 200 for the deploy health check', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'success', data: { ok: true } });
  });
});
