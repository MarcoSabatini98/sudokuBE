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

// Tiering del vocabolario per difficoltà:
// - easy: solo parole comuni; più caselle nere (slot corti) e budget alto, così
//   il pool ridotto basta. Offline il fill lento è accettabile.
// - medium/hard: vocabolario completo (anche rare) come a runtime.
const TIER = {
  easy: { commonOnly: true, maxFillSteps: 60000, blackRatio: 0.4 },
  medium: {},
  hard: {},
};

function generateOne(difficulty) {
  const opts = TIER[difficulty] || {};
  try {
    return generateCrossword({ difficulty, ...opts });
  } catch (err) {
    // easy common-only può non riempirsi su griglie con slot lunghi: ripiega al vocab pieno
    if (opts.commonOnly) return generateCrossword({ difficulty });
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
