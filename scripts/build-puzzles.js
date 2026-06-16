'use strict';

// Pre-generazione offline degli schemi di cruciverba salvati in DB.
// Uso: npx sequelize-cli db:migrate (una volta) && node scripts/build-puzzles.js
// Variabili: PUZZLES_PER_DIFFICULTY (default 12).

require('dotenv').config();

const { sequelize } = require('../src/models');
const crosswordRepository = require('../src/repositories/crossword.repository');
const { generateCrossword } = require('../src/services/crossword.service');
const { DIFFICULTIES } = require('../src/constants/crossword.constants');

const COUNT = Number(process.env.PUZZLES_PER_DIFFICULTY) || 12;

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

function generateOne(difficulty) {
  const opts = TIER[difficulty] || {};
  try {
    return generateCrossword({ difficulty, ...opts });
  } catch (err) {
    // pool ristretto può non riempire: allarga di un tier mantenendo la difficoltà
    if (opts.maxTier !== undefined) {
      return generateCrossword({ difficulty, maxTier: opts.maxTier + 1, maxFillSteps: 60000 });
    }
    throw err;
  }
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
