'use strict';

const mockExistingRecord = {
  best_time_seconds: 100,
  update: jest.fn().mockResolvedValue(),
};

jest.mock('../src/models', () => ({
  Record: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
  Game: {},
}));

const { Record } = require('../src/models');
const { upsert } = require('../src/repositories/record.repository');

describe('record.repository – upsert', () => {
  it('creates a new record when none exists', async () => {
    Record.findOne.mockResolvedValue(null);
    Record.create.mockResolvedValue({ id: 1 });

    await upsert('easy', 90, 5);

    expect(Record.create).toHaveBeenCalledWith(
      { difficulty: 'easy', best_time_seconds: 90, game_id: 5 },
      { transaction: null }
    );
  });

  it('updates record when new time is better', async () => {
    Record.findOne.mockResolvedValue({ ...mockExistingRecord });

    await upsert('easy', 80, 6);

    expect(mockExistingRecord.update).toHaveBeenCalledWith(
      { best_time_seconds: 80, game_id: 6 },
      { transaction: null }
    );
  });

  it('does NOT update record when new time is worse', async () => {
    const existingCopy = { best_time_seconds: 100, update: jest.fn() };
    Record.findOne.mockResolvedValue(existingCopy);

    await upsert('easy', 150, 7);

    expect(existingCopy.update).not.toHaveBeenCalled();
  });

  it('does NOT update record when new time equals best', async () => {
    const existingCopy = { best_time_seconds: 100, update: jest.fn() };
    Record.findOne.mockResolvedValue(existingCopy);

    await upsert('easy', 100, 8);

    expect(existingCopy.update).not.toHaveBeenCalled();
  });
});
