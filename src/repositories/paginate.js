'use strict';

/**
 * Lista paginata generica per un modello con colonna `played_at`.
 * Ritorna { data, pagination: { total, page, limit, totalPages } }.
 */
async function paginate(model, { difficulty, page = 1, limit = 20 } = {}) {
  const where = {};
  if (difficulty) where.difficulty = difficulty;
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findAll({ where, order: [['played_at', 'DESC']], limit, offset }),
    model.count({ where }),
  ]);

  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

module.exports = { paginate };
