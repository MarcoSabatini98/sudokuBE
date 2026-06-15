'use strict';

const {
  BOARD_SIZE,
  DEFAULT_MAX_WORDS,
  MIN_WORD_LENGTH,
  MAX_WORD_LENGTH,
  CROSSWORD_WORDS,
} = require('../constants/crossword.constants');

const ACCENTS = { À: 'A', Á: 'A', È: 'E', É: 'E', Ì: 'I', Í: 'I', Ò: 'O', Ó: 'O', Ù: 'U', Ú: 'U' };

const DIRS = {
  across: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Normalizza una parola a sole lettere A-Z maiuscole (accenti rimossi). */
function normalizeAnswer(raw) {
  return [...raw.toUpperCase()]
    .map((ch) => ACCENTS[ch] || ch)
    .filter((ch) => ch >= 'A' && ch <= 'Z')
    .join('');
}

/** Prepara la wordlist: normalizza, filtra per lunghezza e rimuove i duplicati. */
function prepareWords(list) {
  const seen = new Set();
  const out = [];
  for (const { answer, clue } of list) {
    const norm = normalizeAnswer(answer);
    if (norm.length < MIN_WORD_LENGTH || norm.length > MAX_WORD_LENGTH) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push({ answer: norm, clue });
  }
  return out;
}

function createBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function cellAt(board, r, c) {
  if (r < 0 || c < 0 || r >= board.length || c >= board.length) return undefined; // fuori griglia
  return board[r][c];
}

/** true se la cella contiene una lettera (non vuota, non fuori griglia). */
function isFilled(value) {
  return typeof value === 'string';
}

/** I tappi prima dell'inizio e dopo la fine della parola devono essere vuoti. */
function flanksAreClear(board, row, col, dir, len) {
  const { dr, dc } = DIRS[dir];
  return (
    !isFilled(cellAt(board, row - dr, col - dc)) &&
    !isFilled(cellAt(board, row + dr * len, col + dc * len))
  );
}

/** I vicini perpendicolari alla parola (per evitare parole parallele appiccicate). */
function sidesAreClear(board, r, c, dr, dc) {
  return !isFilled(cellAt(board, r + dc, c + dr)) && !isFilled(cellAt(board, r - dc, c - dr));
}

/**
 * Verifica se `word` entra a (row,col) nella direzione data: dentro i bordi,
 * incroci coerenti, niente fusione con parole adiacenti e niente parallele
 * appiccicate. Ritorna il numero di incroci, o -1 se non piazzabile.
 */
function placementCrossings(board, word, row, col, dir, isFirst) {
  const { dr, dc } = DIRS[dir];
  if (!flanksAreClear(board, row, col, dir, word.length)) return -1;

  let crossings = 0;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = cellAt(board, r, c);
    if (existing === word[i]) {
      crossings++; // incrocio coerente
    } else if (existing !== null) {
      return -1; // fuori griglia (undefined) o lettera diversa
    } else if (!sidesAreClear(board, r, c, dr, dc)) {
      return -1; // cella nuova con una parallela adiacente
    }
  }
  if (!isFirst && crossings < 1) return -1; // ogni parola (tranne la prima) deve incrociare
  return crossings;
}

function writeWord(board, word, row, col, dir) {
  const { dr, dc } = DIRS[dir];
  for (let i = 0; i < word.length; i++) board[row + dr * i][col + dc * i] = word[i];
  return { row, col, dir, length: word.length };
}

/** Cerca il miglior piazzamento (più incroci) di `word` incrociando lettere già presenti. */
function findPlacement(board, word) {
  let best = null;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      const letter = board[r][c];
      if (letter === null) continue;
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) continue;
        best = betterOf(best, tryAt(board, word, r - i, c, 'down'));
        best = betterOf(best, tryAt(board, word, r, c - i, 'across'));
      }
    }
  }
  return best;
}

function tryAt(board, word, row, col, dir) {
  const crossings = placementCrossings(board, word, row, col, dir, false);
  return crossings < 0 ? null : { row, col, dir, crossings };
}

function betterOf(a, b) {
  if (!a) return b;
  if (!b) return a;
  return b.crossings > a.crossings ? b : a;
}

/** Ritaglia la griglia al bounding box delle lettere; ritorna offset e dimensioni. */
function boundingBox(board) {
  let minR = Infinity;
  let minC = Infinity;
  let maxR = -Infinity;
  let maxC = -Infinity;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === null) continue;
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }
  }
  return { minR, minC, rows: maxR - minR + 1, cols: maxC - minC + 1 };
}

/** Costruisce la griglia ritagliata con numeri di cella e ritorna la mappa numeri. */
function buildCells(board, box) {
  const { minR, minC, rows, cols } = box;
  const cells = Array.from({ length: rows }, () => Array(cols).fill(null));
  const numberAt = new Map();
  let next = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const letter = board[r + minR][c + minC];
      if (letter === null) continue;
      const startsAcross =
        !isFilled(cellAt(board, r + minR, c + minC - 1)) && isFilled(cellAt(board, r + minR, c + minC + 1));
      const startsDown =
        !isFilled(cellAt(board, r + minR - 1, c + minC)) && isFilled(cellAt(board, r + minR + 1, c + minC));
      let number = null;
      if (startsAcross || startsDown) {
        number = next++;
        numberAt.set(`${r},${c}`, number);
      }
      cells[r][c] = { solution: letter, number };
    }
  }
  return { cells, numberAt };
}

function buildEntries(placements, box, numberAt) {
  const { minR, minC } = box;
  return placements
    .map((p) => {
      const row = p.row - minR;
      const col = p.col - minC;
      return {
        number: numberAt.get(`${row},${col}`) || null,
        direction: p.dir,
        row,
        col,
        length: p.word.length,
        clue: p.clue,
        answer: p.word,
      };
    })
    .sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));
}

/**
 * Genera un cruciverba a incastro dalla wordlist: piazza la parola più lunga al
 * centro, poi incrocia le successive. Ritorna griglia ritagliata + definizioni.
 */
function generateCrossword({ maxWords = DEFAULT_MAX_WORDS, words = CROSSWORD_WORDS } = {}) {
  const prepared = shuffle(prepareWords(words)).sort((a, b) => b.answer.length - a.answer.length);
  if (prepared.length === 0) return { rows: 0, cols: 0, cells: [], entries: [] };

  const board = createBoard(BOARD_SIZE);
  const placements = [];

  const first = prepared[0];
  const startCol = Math.floor((BOARD_SIZE - first.answer.length) / 2);
  const midRow = Math.floor(BOARD_SIZE / 2);
  writeWord(board, first.answer, midRow, startCol, 'across');
  placements.push({ word: first.answer, clue: first.clue, row: midRow, col: startCol, dir: 'across' });

  for (const { answer, clue } of prepared.slice(1)) {
    if (placements.length >= maxWords) break;
    const spot = findPlacement(board, answer);
    if (!spot) continue;
    writeWord(board, answer, spot.row, spot.col, spot.dir);
    placements.push({ word: answer, clue, row: spot.row, col: spot.col, dir: spot.dir });
  }

  const box = boundingBox(board);
  const { cells, numberAt } = buildCells(board, box);
  const entries = buildEntries(placements, box, numberAt);
  return { rows: box.rows, cols: box.cols, cells, entries };
}

module.exports = {
  generateCrossword,
  normalizeAnswer,
  prepareWords,
  placementCrossings,
};
