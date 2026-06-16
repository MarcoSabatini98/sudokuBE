'use strict';

/**
 * Accorcia una definizione a ~maxLen caratteri tagliando a una cesura naturale
 * (fine frase o inciso) senza puntini di sospensione. `maxLen` 0/assente = intera.
 * Usato per rendere più concise le definizioni ai livelli facile/medio.
 */
function shortenClue(clue, maxLen) {
  if (!maxLen || clue.length <= maxLen) return clue;
  const slice = clue.slice(0, maxLen);
  let cut = Math.max(slice.lastIndexOf('; '), slice.lastIndexOf('. '), slice.lastIndexOf(', '));
  if (cut < maxLen * 0.5) cut = slice.lastIndexOf(' '); // nessuna cesura: ultimo spazio
  return (cut > 0 ? clue.slice(0, cut) : slice).trim();
}

module.exports = { shortenClue };
