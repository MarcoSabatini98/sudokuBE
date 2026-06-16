'use strict';

// Integrazione opzionale con Ollama (LLM locale) per definizioni in stile
// cruciverba. Tutto non bloccante: se Ollama non risponde, i chiamanti ripiegano
// sulle definizioni del dump. Usato solo in preparazione offline (enrich-clues),
// mai a runtime (latenza).

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const PROBE_TIMEOUT_MS = 1500;
const GENERATE_TIMEOUT_MS = 20000;

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new globalThis.AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await globalThis.fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** True se Ollama risponde e il modello richiesto è installato. Non lancia mai. */
async function isAvailable() {
  try {
    const res = await fetchWithTimeout(`${OLLAMA_URL}/api/tags`, {}, PROBE_TIMEOUT_MS);
    if (!res.ok) return false;
    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const base = `${OLLAMA_MODEL.split(':')[0]}:`;
    return models.some(
      (m) => typeof m.name === 'string' && (m.name === OLLAMA_MODEL || m.name.startsWith(base))
    );
  } catch {
    return false;
  }
}

function sanitizeClue(text) {
  if (!text || typeof text !== 'string') return null;
  const clue = text
    .trim()
    .replace(/^["'«»\s]+/, '')
    .replace(/["'«».\s]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clue.length ? clue : null;
}

/** Definizione stile cruciverba per `word`, o null se Ollama non risponde. */
async function generateClue(word) {
  const prompt =
    `Sei un autore di cruciverba italiani. Scrivi UNA sola definizione breve e arguta ` +
    `(massimo 8 parole) per la parola "${word}". Non usare la parola stessa. ` +
    `Rispondi solo con la definizione, senza virgolette e senza punto finale.`;
  try {
    const res = await fetchWithTimeout(
      `${OLLAMA_URL}/api/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      },
      GENERATE_TIMEOUT_MS
    );
    if (!res.ok) return null;
    const data = await res.json();
    return sanitizeClue(data.response);
  } catch {
    return null;
  }
}

module.exports = { isAvailable, generateClue };
