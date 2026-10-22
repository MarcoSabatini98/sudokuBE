'use strict';

const machiavelliRepository = require('../repositories/machiavelli.repository');

const getAll = async (filters) => machiavelliRepository.findAll(filters);

const save = async ({ won, duration_seconds, bot_difficulty }) =>
  machiavelliRepository.create({ won, duration_seconds, bot_difficulty });

/** Miglior tempo di vittoria per difficoltà bot: [{ bot_difficulty, best_time_seconds }]. */
const getRecords = async () => machiavelliRepository.bestWinByDifficulty();

module.exports = { getAll, save, getRecords };
