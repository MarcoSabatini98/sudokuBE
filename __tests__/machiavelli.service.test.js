'use strict';

jest.mock('../src/repositories/machiavelli.repository', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findBestWin: jest.fn(),
}));

const machiavelliRepository = require('../src/repositories/machiavelli.repository');
const { save, getAll, getRecord } = require('../src/services/machiavelli.service');

describe('machiavelli.service – save', () => {
  it('creates a game via repository', async () => {
    const fakeGame = { id: 1, won: true, duration_seconds: 300 };
    machiavelliRepository.create.mockResolvedValue(fakeGame);

    const result = await save({ won: true, duration_seconds: 300 });

    expect(machiavelliRepository.create).toHaveBeenCalledWith({ won: true, duration_seconds: 300 });
    expect(result).toBe(fakeGame);
  });
});

describe('machiavelli.service – getAll', () => {
  it('delegates to repository.findAll', async () => {
    const fakeList = { data: [{ id: 1 }], pagination: {} };
    machiavelliRepository.findAll.mockResolvedValue(fakeList);

    const result = await getAll({ page: 1, limit: 20 });

    expect(machiavelliRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(result).toBe(fakeList);
  });
});

describe('machiavelli.service – getRecord', () => {
  it('returns best winning time when a win exists', async () => {
    machiavelliRepository.findBestWin.mockResolvedValue({ id: 5, duration_seconds: 240, won: true });

    const result = await getRecord();

    expect(result.best_time_seconds).toBe(240);
    expect(result.best_game.id).toBe(5);
  });

  it('returns null best time when no win exists', async () => {
    machiavelliRepository.findBestWin.mockResolvedValue(null);

    const result = await getRecord();

    expect(result.best_time_seconds).toBeNull();
    expect(result.best_game).toBeNull();
  });
});
