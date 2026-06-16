'use strict';

// Arricchimento offline delle definizioni con Ollama: genera clue in stile
// cruciverba per le parole comuni e le salva in src/data/clue-cache.json, che
// dictionary.service preferisce alle definizioni del dump.
// Uso: node scripts/enrich-clues.js   (ENRICH_LIMIT=N per limitare).
// Senza Ollama lo script esce subito senza modificare nulla.

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { allEntries } = require('../src/services/dictionary.service');
const { isAvailable, generateClue } = require('../src/services/ollama.service');

const CACHE_PATH = path.resolve('src', 'data', 'clue-cache.json');
const LIMIT = Number(process.env.ENRICH_LIMIT) || 0; // 0 = tutte le comuni

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
}

/** Parole da arricchire: facili+medie (tier ≤ 1) non ancora in cache. */
function selectWords(cache) {
  const words = allEntries()
    .filter((e) => e.tier <= 1)
    .map((e) => e.word)
    .filter((w) => !cache[w]);
  return LIMIT > 0 ? words.slice(0, LIMIT) : words;
}

/** Genera le definizioni con Ollama, salvando la cache ogni 25 parole. */
async function enrichLoop(words, cache) {
  let done = 0;
  for (const word of words) {
    const clue = await generateClue(word);
    if (clue) cache[word] = clue;
    done += 1;
    if (done % 25 === 0) {
      saveCache(cache);
      console.log(`  ${done}/${words.length}`);
    }
  }
}

async function main() {
  if (!(await isAvailable())) {
    console.log('Ollama non disponibile: nessun arricchimento (restano le definizioni del dump).');
    return;
  }

  const cache = loadCache();
  const words = selectWords(cache);
  console.log(`Arricchimento di ${words.length} parole con ${process.env.OLLAMA_MODEL || 'llama3.2:3b'}...`);

  await enrichLoop(words, cache);

  saveCache(cache);
  console.log(`Fatto. Cache: ${Object.keys(cache).length} definizioni → ${CACHE_PATH}`);
}

main().catch((err) => {
  console.error('Arricchimento fallito:', err.message);
  process.exit(1);
});
