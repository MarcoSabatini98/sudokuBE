'use strict';

jest.mock('../src/config/db', () => require('./helpers/appMocks').mockDb());
jest.mock('../src/models', () => require('./helpers/appMocks').mockCoreModels());

const { CrosswordPuzzle } = require('../src/models');
const repo = require('../src/repositories/crossword.repository');

describe('crossword.repository', () => {
  it('findRandom queries one row at random by difficulty', async () => {
    CrosswordPuzzle.findOne.mockResolvedValue({ id: 1, payload: { difficulty: 'hard' } });

    const row = await repo.findRandom('hard');

    expect(CrosswordPuzzle.findOne).toHaveBeenCalledWith({
      where: { difficulty: 'hard' },
      order: 'RAND()',
    });
    expect(row.id).toBe(1);
  });

  it('saveMany bulk-creates rows with difficulty and payload', async () => {
    await repo.saveMany('easy', [{ a: 1 }, { b: 2 }]);

    expect(CrosswordPuzzle.bulkCreate).toHaveBeenCalledWith([
      { difficulty: 'easy', payload: { a: 1 } },
      { difficulty: 'easy', payload: { b: 2 } },
    ]);
  });

  it('clearByDifficulty deletes rows for a difficulty', async () => {
    await repo.clearByDifficulty('medium');
    expect(CrosswordPuzzle.destroy).toHaveBeenCalledWith({ where: { difficulty: 'medium' } });
  });
});
