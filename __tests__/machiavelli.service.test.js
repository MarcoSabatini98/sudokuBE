'use strict';

jest.mock('../src/repositories/machiavelli.repository', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  bestWinByDifficulty: jest.fn(),
}));

const machiavelliRepository = require('../src/repositories/machiavelli.repository');
const { save, getAll, getRecords } = require('../src/services/machiavelli.service');

describe('machiavelli.service – save', () => {
  it('creates a game via repository', async () => {
    const fakeGame = { id: 1, won: true, duration_seconds: 300, bot_difficulty: 'medium' };
    machiavelliRepository.create.mockResolvedValue(fakeGame);

    const result = await save({ won: true, duration_seconds: 300, bot_difficulty: 'medium' });

    expect(machiavelliRepository.create).toHaveBeenCalledWith({
      won: true,
      duration_seconds: 300,
      bot_difficulty: 'medium',
    });
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

describe('machiavelli.service – getRecords', () => {
  it('returns best winning time per difficulty', async () => {
    const rows = [
      { bot_difficulty: 'easy', best_time_seconds: 180 },
      { bot_difficulty: 'medium', best_time_seconds: 240 },
    ];
    machiavelliRepository.bestWinByDifficulty.mockResolvedValue(rows);

    const result = await getRecords();

    expect(result).toBe(rows);
  });

  it('returns an empty list when no win exists', async () => {
    machiavelliRepository.bestWinByDifficulty.mockResolvedValue([]);

    const result = await getRecords();

    expect(result).toEqual([]);
  });
});
