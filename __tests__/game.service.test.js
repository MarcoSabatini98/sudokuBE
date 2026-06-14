'use strict';

jest.mock('../src/models', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock('../src/repositories/game.repository', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../src/repositories/record.repository', () => ({
  upsert: jest.fn(),
}));

const { sequelize } = require('../src/models');
const gameRepository = require('../src/repositories/game.repository');
const recordRepository = require('../src/repositories/record.repository');
const { save, getAll } = require('../src/services/game.service');

const mockTx = {
  commit: jest.fn().mockResolvedValue(),
  rollback: jest.fn().mockResolvedValue(),
};

beforeEach(() => {
  sequelize.transaction.mockResolvedValue(mockTx);
});

describe('game.service – save', () => {
  it('creates game and upserts record when completed=true', async () => {
    const fakeGame = { id: 1, difficulty: 'easy', time_seconds: 120 };
    gameRepository.create.mockResolvedValue(fakeGame);
    recordRepository.upsert.mockResolvedValue({});

    const result = await save({ difficulty: 'easy', time_seconds: 120, completed: true });

    expect(gameRepository.create).toHaveBeenCalledWith(
      { difficulty: 'easy', time_seconds: 120, completed: true },
      mockTx
    );
    expect(recordRepository.upsert).toHaveBeenCalledWith('easy', 120, 1, mockTx);
    expect(mockTx.commit).toHaveBeenCalled();
    expect(result).toBe(fakeGame);
  });

  it('creates game but skips record upsert when completed=false', async () => {
    const fakeGame = { id: 2, difficulty: 'hard', time_seconds: 300 };
    gameRepository.create.mockResolvedValue(fakeGame);

    await save({ difficulty: 'hard', time_seconds: 300, completed: false });

    expect(recordRepository.upsert).not.toHaveBeenCalled();
    expect(mockTx.commit).toHaveBeenCalled();
  });

  it('rolls back transaction on error', async () => {
    gameRepository.create.mockRejectedValue(new Error('DB error'));

    await expect(save({ difficulty: 'easy', time_seconds: 60, completed: true }))
      .rejects.toThrow('DB error');

    expect(mockTx.rollback).toHaveBeenCalled();
    expect(mockTx.commit).not.toHaveBeenCalled();
  });
});

describe('game.service – getAll', () => {
  it('delegates to gameRepository.findAll', async () => {
    const fakeList = [{ id: 1 }];
    gameRepository.findAll.mockResolvedValue(fakeList);

    const result = await getAll({ difficulty: 'easy' });

    expect(gameRepository.findAll).toHaveBeenCalledWith({ difficulty: 'easy' });
    expect(result).toBe(fakeList);
  });
});
