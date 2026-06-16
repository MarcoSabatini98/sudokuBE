'use strict';

// Pre-generazione offline degli schemi di cruciverba salvati in DB.
// Uso: npx sequelize-cli db:migrate (una volta) && node scripts/build-puzzles.js
// Variabili: PUZZLES_PER_DIFFICULTY (default 12).

require('dotenv').config();

const { sequelize } = require('../src/models');
const crosswordRepository = require('../src/repositories/crossword.repository');
const { generateCrossword } = require('../src/services/crossword.service');
const { shortenClue } = require('../src/services/crossword/clue');
const { DIFFICULTIES } = require('../src/constants/crossword.constants');

const COUNT = Number(process.env.PUZZLES_PER_DIFFICULTY) || 12;

// Lunghezza massima delle definizioni per difficoltà (0 = intera).
// Facile: concise; medio: moderate; difficile: definizione completa/accurata.
const CLUE_MAX = { easy: 70, medium: 130, hard: 0 };

// Tiering del vocabolario per difficoltà (offline il fill lento è accettabile):
// - easy: solo parole facili (tier 0); più caselle nere (slot corti) e budget
//   alto, così il pool ridotto basta.
// - medium: parole facili + medie (tier ≤ 1).
// - hard: vocabolario completo (anche rare).
const TIER = {
  easy: { maxTier: 0, maxFillSteps: 60000, blackRatio: 0.4 },
  medium: { maxTier: 1, maxFillSteps: 30000 },
  hard: {},
};

/** Accorcia le definizioni del payload secondo il limite della difficoltà. */
function withShortClues(payload, difficulty) {
  const max = CLUE_MAX[difficulty] || 0;
  if (!max) return payload;
  payload.entries = payload.entries.map((e) => ({ ...e, clue: shortenClue(e.clue, max) }));
  return payload;
}

function generateOne(difficulty) {
  const opts = TIER[difficulty] || {};
  let payload;
  try {
    payload = generateCrossword({ difficulty, ...opts });
  } catch (err) {
    // pool ristretto può non riempire: allarga di un tier mantenendo la difficoltà
    if (opts.maxTier === undefined) throw err;
    payload = generateCrossword({ difficulty, maxTier: opts.maxTier + 1, maxFillSteps: 60000 });
  }
  return withShortClues(payload, difficulty);
}

async function main() {
  await sequelize.authenticate();

  for (const difficulty of DIFFICULTIES) {
    const payloads = [];
    for (let i = 0; i < COUNT; i++) payloads.push(generateOne(difficulty));

    await crosswordRepository.clearByDifficulty(difficulty);
    await crosswordRepository.saveMany(difficulty, payloads);
    console.log(`[${difficulty}] generati e salvati ${payloads.length} schemi`);
  }

  await sequelize.close();
  console.log('Pre-generazione completata.');
}

main().catch((err) => {
  console.error('Pre-generazione fallita:', err.message);
  process.exit(1);
});
