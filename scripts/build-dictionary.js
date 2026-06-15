'use strict';

/*
 * Costruisce il dizionario del cruciverba dal dump di it.wiktionary.
 *
 * Uso (offline, in preparazione — non runtime):
 *   bzip2 -dc itwiktionary-latest-pages-articles.xml.bz2 | node scripts/build-dictionary.js
 *
 * Legge l'XML decompresso da stdin in streaming, estrae per ogni voce italiana
 * la prima definizione (saltando forme flesse e voci senza definizione), e
 * scrive src/data/crossword-dictionary.json: [{ word, clue, common }].
 */

const fs = require('fs');
const path = require('path');

const COMMON = new Set(require('../src/data/wordlist-it.json'));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'crossword-dictionary.json');

const MIN_LEN = 3;
const MAX_LEN = 12;
const MAX_CLUE = 140;

const ACCENTS = { à: 'a', á: 'a', è: 'e', é: 'e', ì: 'i', í: 'i', ò: 'o', ó: 'o', ù: 'u', ú: 'u' };

function normalizeWord(title) {
  if (!/^[a-zàáèéìíòóùú]+$/i.test(title)) return null; // solo parole singole di lettere
  if (title[0] !== title[0].toLowerCase()) return null; // niente iniziale maiuscola (nomi propri)
  const word = [...title.toLowerCase()].map((c) => ACCENTS[c] || c).join('').toUpperCase();
  return word.length >= MIN_LEN && word.length <= MAX_LEN ? word : null;
}

function unescapeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Ritaglia la sola sezione italiana del wikitext (== {{-it-}} == … prossima lingua). */
function italianSection(content) {
  const start = content.search(/==\s*\{\{-it-\}\}\s*==/);
  if (start === -1) return null;
  const rest = content.slice(start + 3);
  const nextLang = rest.search(/\n==\s*\{\{-[a-z]+-\}\}\s*==/);
  return nextLang === -1 ? content.slice(start) : content.slice(start, start + 3 + nextLang);
}

/** true se la sezione è solo una forma flessa (nessun POS lemma). */
function isOnlyInflectedForm(section) {
  const pos = [...section.matchAll(/\{\{-([a-z ]+?)-\|/g)].map((m) => m[1]);
  if (pos.length === 0) return false;
  return pos.every((p) => p.includes('form'));
}

function cleanDefinition(raw) {
  let s = raw;
  s = s.replace(/\{\{Term\|([^|}]+)(?:\|[^}]*)?\}\}/gi, '($1)'); // etichette di dominio
  s = s.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1'); // [[a|b]] -> b
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1'); // [[a]] -> a
  let prev;
  do {
    prev = s;
    s = s.replace(/\{\{[^{}]*\}\}/g, ''); // template residui (anche annidati, ripetendo)
  } while (s !== prev);
  s = s.replace(/'''?/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '');
  s = s.replace(/\s+/g, ' ').trim().replace(/^[;:,\s]+|[;:,\s]+$/g, '');
  if (s.length > MAX_CLUE) s = `${s.slice(0, MAX_CLUE).replace(/\s+\S*$/, '')}…`;
  return s;
}

function firstDefinition(section) {
  for (const line of section.split('\n')) {
    const m = line.match(/^#(?![:*;])\s*(.+)/);
    if (!m || /\{\{Nodef/i.test(line)) continue;
    const def = cleanDefinition(m[1]);
    if (def.length >= 3) return def;
  }
  return null;
}

function entryFromPage(title, content) {
  const word = normalizeWord(title);
  if (!word) return null;
  const section = italianSection(content);
  if (!section || isOnlyInflectedForm(section)) return null;
  const clue = firstDefinition(section);
  if (!clue) return null;
  return { word, clue, common: COMMON.has(word) };
}

/** Estrae la voce da un blocco XML <page>…</page> (solo namespace principale). */
function entryFromBlock(block) {
  if (!/<ns>0<\/ns>/.test(block)) return null;
  const titleM = block.match(/<title>([\s\S]*?)<\/title>/);
  const textM = block.match(/<text[^>]*>([\s\S]*?)<\/text>/);
  if (!titleM || !textM) return null;
  return entryFromPage(unescapeXml(titleM[1]), unescapeXml(textM[1]));
}

// -- Streaming dello stdin: estrae i blocchi <page>…</page> ------------------

function runFromStdin() {
  const seen = new Set();
  const entries = [];
  let buffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf('</page>')) !== -1) {
      const start = buffer.lastIndexOf('<page>', end);
      const entry = start === -1 ? null : entryFromBlock(buffer.slice(start, end));
      if (entry && !seen.has(entry.word)) {
        seen.add(entry.word);
        entries.push(entry);
      }
      buffer = buffer.slice(end + 7);
    }
  });

  process.stdin.on('end', () => {
    entries.sort((a, b) => a.word.localeCompare(b.word));
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(entries)}\n`);
    const common = entries.filter((e) => e.common).length;
    process.stdout.write(`voci: ${entries.length} (comuni ${common}, rare ${entries.length - common})\n`);
  });
}

module.exports = {
  normalizeWord,
  cleanDefinition,
  italianSection,
  isOnlyInflectedForm,
  firstDefinition,
  entryFromPage,
  entryFromBlock,
};

if (require.main === module) runFromStdin();
