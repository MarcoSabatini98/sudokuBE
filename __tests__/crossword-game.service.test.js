'use strict';

jest.mock('../src/repositories/crossword-game.repository', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  bestByDifficulty: jest.fn(),
}));

const repo = require('../src/repositories/crossword-game.repository');
const { save, getAll, getRecords } = require('../src/services/crossword-game.service');

describe('crossword-game.service', () => {
  it('save delegates to repository.create', async () => {
    repo.create.mockResolvedValue({ id: 1, difficulty: 'easy', time_seconds: 200 });

    const game = await save({ difficulty: 'easy', time_seconds: 200 });

    expect(repo.create).toHaveBeenCalledWith({ difficulty: 'easy', time_seconds: 200 });
    expect(game.id).toBe(1);
  });

  it('getAll delegates to repository.findAll', async () => {
    const list = { data: [], pagination: {} };
    repo.findAll.mockResolvedValue(list);

    const result = await getAll({ page: 1, limit: 20 });

    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(result).toBe(list);
  });

  it('getRecords delegates to repository.bestByDifficulty', async () => {
    repo.bestByDifficulty.mockResolvedValue([{ difficulty: 'hard', best_time_seconds: 300 }]);

    const records = await getRecords();

    expect(records[0].best_time_seconds).toBe(300);
  });
});
