'use strict';

// Dimensioni di lavoro della griglia e numero di parole per schema.
// La griglia finale viene ritagliata al bounding box delle parole piazzate.
const BOARD_SIZE = 15;
const DEFAULT_MAX_WORDS = 14;
const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = 11;

// Wordlist italiana di esempio (parola + definizione in stile cruciverba).
// Temporanea: verrà sostituita/ampliata da una wordlist open + Wikizionario.
const CROSSWORD_WORDS = [
  { answer: 'CANE', clue: 'Il migliore amico dell’uomo' },
  { answer: 'GATTO', clue: 'Felino domestico' },
  { answer: 'MARE', clue: 'Distesa d’acqua salata' },
  { answer: 'SOLE', clue: 'La stella del giorno' },
  { answer: 'LUNA', clue: 'Il satellite della Terra' },
  { answer: 'ROMA', clue: 'La capitale d’Italia' },
  { answer: 'LIBRO', clue: 'Si legge pagina dopo pagina' },
  { answer: 'PENNA', clue: 'Scrive con l’inchiostro' },
  { answer: 'FIORE', clue: 'Sboccia in primavera' },
  { answer: 'ALBERO', clue: 'Ha tronco, rami e foglie' },
  { answer: 'PANE', clue: 'Si fa con la farina' },
  { answer: 'VINO', clue: 'Rosso o bianco, a tavola' },
  { answer: 'CASA', clue: 'Dove si abita' },
  { answer: 'PORTA', clue: 'Si apre e si chiude' },
  { answer: 'TAVOLO', clue: 'Mobile con le gambe' },
  { answer: 'SEDIA', clue: 'Ci si siede sopra' },
  { answer: 'MANO', clue: 'Ha cinque dita' },
  { answer: 'PIEDE', clue: 'In fondo alla gamba' },
  { answer: 'OCCHIO', clue: 'Serve per vedere' },
  { answer: 'NOTTE', clue: 'Il buio dopo il tramonto' },
  { answer: 'GIORNO', clue: 'Dura ventiquattro ore' },
  { answer: 'TRENO', clue: 'Viaggia sui binari' },
  { answer: 'STRADA', clue: 'La percorrono le auto' },
  { answer: 'ISOLA', clue: 'Terra circondata dal mare' },
  { answer: 'MONTE', clue: 'Un alto rilievo' },
  { answer: 'FIUME', clue: 'Scorre verso il mare' },
  { answer: 'LAGO', clue: 'Specchio d’acqua dolce' },
  { answer: 'NEVE', clue: 'Cade bianca d’inverno' },
  { answer: 'VENTO', clue: 'Soffia e muove le foglie' },
  { answer: 'FUOCO', clue: 'Brucia e scalda' },
  { answer: 'TERRA', clue: 'Il nostro pianeta' },
  { answer: 'STELLA', clue: 'Brilla nel cielo notturno' },
  { answer: 'NAVE', clue: 'Solca i mari' },
  { answer: 'AEREO', clue: 'Vola nel cielo' },
  { answer: 'MUSICA', clue: 'L’arte dei suoni' },
  { answer: 'CANTO', clue: 'Melodia con la voce' },
  { answer: 'SALE', clue: 'Condisce e dà sapore' },
  { answer: 'RANA', clue: 'Anfibio che gracida' },
  { answer: 'ORSO', clue: 'Va in letargo d’inverno' },
  { answer: 'LATTE', clue: 'Bianco, dalla mucca' },
];

module.exports = {
  BOARD_SIZE,
  DEFAULT_MAX_WORDS,
  MIN_WORD_LENGTH,
  MAX_WORD_LENGTH,
  CROSSWORD_WORDS,
};
