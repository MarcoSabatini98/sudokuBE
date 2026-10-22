'use strict';

const { MIN_SLOT } = require('../../constants/crossword.constants');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeGrid(rows, cols, value) {
  return Array.from({ length: rows }, () => Array(cols).fill(value));
}

/** Lunghezza del run di caselle bianche che passa per (r,c) nella direzione data. */
function runLength(black, rows, cols, r, c, dr, dc) {
  const inside = (rr, cc) => rr >= 0 && cc >= 0 && rr < rows && cc < cols && !black[rr][cc];
  let len = 0;
  for (let rr = r, cc = c; inside(rr, cc); rr -= dr, cc -= dc) len++;
  for (let rr = r + dr, cc = c + dc; inside(rr, cc); rr += dr, cc += dc) len++;
  return len;
}

const NEIGHBORS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

/** Conta le caselle bianche e ritorna la prima trovata (start del flood fill). */
function whiteStats(black, rows, cols) {
  let start = null;
  let white = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (black[r][c]) continue;
      white += 1;
      if (!start) start = [r, c];
    }
  }
  return { white, start };
}

function pushWhiteNeighbors(black, rows, cols, seen, stack, r, c) {
  for (const [dr, dc] of NEIGHBORS) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
    if (black[nr][nc] || seen[nr][nc]) continue;
    seen[nr][nc] = true;
    stack.push([nr, nc]);
  }
}

/** true se tutte le caselle bianche formano un'unica regione connessa (4-vicini). */
function whiteIsConnected(black, rows, cols) {
  const { white, start } = whiteStats(black, rows, cols);
  if (!start) return true;

  const seen = makeGrid(rows, cols, false);
  const stack = [start];
  seen[start[0]][start[1]] = true;
  let visited = 0;
  while (stack.length) {
    const [r, c] = stack.pop();
    visited += 1;
    pushWhiteNeighbors(black, rows, cols, seen, stack, r, c);
  }
  return visited === white;
}

/**
 * Pattern valido: nessuna parola da 2, ogni casella bianca in almeno uno slot
 * ≥3, e tutte le bianche connesse (niente parole/zone isolate dal resto).
 */
function patternIsValid(black, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (black[r][c]) continue;
      const h = runLength(black, rows, cols, r, c, 0, 1);
      const v = runLength(black, rows, cols, r, c, 1, 0);
      if (h === 2 || v === 2) return false;
      if (h < MIN_SLOT && v < MIN_SLOT) return false;
    }
  }
  return whiteIsConnected(black, rows, cols);
}

/** Genera un pattern di caselle nere a simmetria 180°, fino alla densità voluta. */
function generatePattern(rows, cols, blackRatio) {
  const black = makeGrid(rows, cols, false);
  const target = Math.floor(rows * cols * blackRatio);
  const positions = shuffle([...Array(rows * cols).keys()].map((i) => [Math.floor(i / cols), i % cols]));
  let count = 0;
  for (const [r, c] of positions) {
    if (count >= target) break;
    if (black[r][c]) continue;
    const r2 = rows - 1 - r;
    const c2 = cols - 1 - c;
    black[r][c] = true;
    black[r2][c2] = true;
    if (patternIsValid(black, rows, cols)) {
      count += r === r2 && c === c2 ? 1 : 2;
    } else {
      black[r][c] = false;
      black[r2][c2] = false;
    }
  }
  return black;
}

function collectRun(black, rows, cols, r, c, dir) {
  const cells = [];
  if (dir === 'across') {
    while (c < cols && !black[r][c]) cells.push([r, c++]);
  } else {
    while (r < rows && !black[r][c]) cells.push([r++, c]);
  }
  return cells;
}

/** Estrae gli slot (run di bianche ≥ MIN_SLOT) orizzontali e verticali. */
function extractSlots(black, rows, cols) {
  const slots = [];
  const addRun = (cells, dir) => {
    if (cells.length >= MIN_SLOT) {
      slots.push({ dir, cells, len: cells.length, row: cells[0][0], col: cells[0][1] });
    }
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; ) {
      if (black[r][c]) { c++; continue; }
      const cells = collectRun(black, rows, cols, r, c, 'across');
      addRun(cells, 'across');
      c += cells.length;
    }
  }
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; ) {
      if (black[r][c]) { r++; continue; }
      const cells = collectRun(black, rows, cols, r, c, 'down');
      addRun(cells, 'down');
      r += cells.length;
    }
  }
  return slots;
}

module.exports = { shuffle, runLength, patternIsValid, generatePattern, extractSlots };
