'use strict';

const { wordsByLength } = require('../dictionary.service');
const { shuffle } = require('./pattern');

const indexCache = {};

/**
 * Indice del dizionario per il fill: parole per lunghezza, limitate al tier di
 * difficoltà (maxTier 0 = solo facili … 2 = tutte, incluse le rare).
 * NB: i tier bassi (pool ridotto) sono pensati per la pre-generazione offline
 * con budget alto; live possono andare in thrashing.
 */
function getIndex(maxTier = 2) {
  if (!indexCache[maxTier]) indexCache[maxTier] = { byLen: wordsByLength({ maxTier }) };
  return indexCache[maxTier];
}

/** Per ogni slot, gli incroci con altri slot: {pos, other, otherPos}. */
function buildCrossings(slots) {
  const cellMap = new Map();
  slots.forEach((slot, si) =>
    slot.cells.forEach(([r, c], pos) => {
      const key = `${r},${c}`;
      const list = cellMap.get(key);
      if (list) list.push({ si, pos });
      else cellMap.set(key, [{ si, pos }]);
    })
  );
  const crossings = slots.map(() => []);
  for (const refs of cellMap.values()) {
    if (refs.length < 2) continue;
    for (const a of refs) {
      for (const b of refs) {
        if (a.si !== b.si) crossings[a.si].push({ pos: a.pos, other: b.si, otherPos: b.pos });
      }
    }
  }
  return crossings;
}

/**
 * Assegna una parola del dizionario a ogni slot con backtracking, ordine MRV e
 * forward checking su domini mantenuti (aggiorna solo gli slot incrociati).
 * Ritorna l'array parola-per-slot, oppure null. Budget di passi per sicurezza.
 */
function fillSlots(slots, index, maxSteps) {
  const crossings = buildCrossings(slots);
  const domains = slots.map((s) => (index.byLen.get(s.len) || []).slice());
  const assigned = new Array(slots.length).fill(null);
  const used = new Set();
  let steps = 0;

  function selectSlot() {
    let best = -1;
    let bestSize = Infinity;
    for (let i = 0; i < slots.length; i++) {
      if (assigned[i] !== null) continue;
      if (domains[i].length < bestSize) {
        bestSize = domains[i].length;
        best = i;
        if (bestSize <= 1) break;
      }
    }
    return best;
  }

  function assign(si, word) {
    used.add(word);
    assigned[si] = word;
    const removed = [];
    for (const { pos, other, otherPos } of crossings[si]) {
      if (assigned[other] !== null) continue;
      const letter = word[pos];
      const keep = [];
      const drop = [];
      for (const w of domains[other]) {
        if (w[otherPos] === letter && w !== word && !used.has(w)) keep.push(w);
        else drop.push(w);
      }
      domains[other] = keep;
      removed.push([other, drop]);
    }
    return removed;
  }

  function undo(si, word, removed) {
    assigned[si] = null;
    used.delete(word);
    for (const [other, drop] of removed) domains[other] = domains[other].concat(drop);
  }

  function solve(count) {
    if (count === slots.length) return true;
    if (++steps > maxSteps) throw new Error('FILL_BUDGET');
    const si = selectSlot();
    if (si === -1) return true;
    if (domains[si].length === 0) return false;
    for (const word of shuffle(domains[si])) {
      if (used.has(word)) continue;
      const removed = assign(si, word);
      const dead = crossings[si].some((x) => assigned[x.other] === null && domains[x.other].length === 0);
      if (!dead && solve(count + 1)) return true;
      undo(si, word, removed);
    }
    return false;
  }

  try {
    return solve(0) ? assigned : null;
  } catch (e) {
    if (e.message === 'FILL_BUDGET') return null;
    throw e;
  }
}

module.exports = { getIndex, fillSlots };
