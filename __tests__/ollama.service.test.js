'use strict';

const { isAvailable, generateClue } = require('../src/services/ollama.service');

function mockFetch(impl) {
  globalThis.fetch = jest.fn(impl);
}

afterEach(() => {
  delete globalThis.fetch;
});

describe('ollama.service – isAvailable', () => {
  it('is true when the requested model is installed', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ models: [{ name: 'llama3.2:3b' }] }) }));
    expect(await isAvailable()).toBe(true);
  });

  it('is false when the model is not installed', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ models: [{ name: 'mistral:7b' }] }) }));
    expect(await isAvailable()).toBe(false);
  });

  it('is false (no throw) when Ollama is unreachable', async () => {
    mockFetch(async () => {
      throw new Error('ECONNREFUSED');
    });
    expect(await isAvailable()).toBe(false);
  });
});

describe('ollama.service – generateClue', () => {
  it('returns a sanitized one-line clue', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ response: '  "Felino domestico."\n' }) }));
    expect(await generateClue('GATTO')).toBe('Felino domestico');
  });

  it('returns null when the request fails', async () => {
    mockFetch(async () => ({ ok: false }));
    expect(await generateClue('GATTO')).toBeNull();
  });
});
