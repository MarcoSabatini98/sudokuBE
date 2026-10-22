'use strict';

jest.mock('../src/repositories/crossword.repository', () => ({
  findRandom: jest.fn(),
}));

const crosswordRepository = require('../src/repositories/crossword.repository');
const { getServedPuzzle } = require('../src/services/crossword-store.service');

describe('crossword-store.service – getServedPuzzle', () => {
  it('serves a saved puzzle when one exists', async () => {
    const payload = { rows: 9, cols: 11, difficulty: 'easy', cells: [], entries: [] };
    crosswordRepository.findRandom.mockResolvedValue({ payload });

    const res = await getServedPuzzle({ difficulty: 'easy' });

    expect(crosswordRepository.findRandom).toHaveBeenCalledWith('easy');
    expect(res).toBe(payload);
  });

  it('falls back to live generation when none are saved', async () => {
    crosswordRepository.findRandom.mockResolvedValue(null);

    const res = await getServedPuzzle({ difficulty: 'medium' });

    expect(res).toHaveProperty('cells');
    expect(res).toHaveProperty('entries');
    expect(res.difficulty).toBe('medium');
  });
});
