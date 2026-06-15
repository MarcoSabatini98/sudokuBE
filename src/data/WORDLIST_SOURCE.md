# Fonti dati cruciverba

## `wordlist-it.json` (tier comune)

Deriva dall'elenco **1000 parole italiane comuni** del progetto
[napolux/paroleitaliane](https://github.com/napolux/paroleitaliane). Usato come
riferimento per marcare il tier "comune" nel dizionario.

Elaborazione applicata: minuscole → rimozione accenti → solo lettere A-Z →
lunghezze 3-12 → deduplica → MAIUSCOLO.

## `crossword-dictionary.json` (dizionario con definizioni)

Generato da `scripts/build-dictionary.js` analizzando il dump di
**it.wiktionary.org** (sezione italiana di ogni voce, prima definizione, forme
flesse escluse). Campi: `{ word, clue, common }`.

I testi delle definizioni provengono da **Wikizionario** e sono rilasciati sotto
**Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)** e GFDL.
Attribuzione: contributori di it.wiktionary.org. Eventuale ridistribuzione delle
definizioni deve mantenere la stessa licenza (share-alike) e l'attribuzione.

Rigenerazione:
```
curl -sL https://dumps.wikimedia.org/itwiktionary/latest/itwiktionary-latest-pages-articles.xml.bz2 -o dump.bz2
bzip2 -dc dump.bz2 | node scripts/build-dictionary.js
```

## Licenza

The MIT License (MIT) — Copyright (c) 2016 Francesco Napoletano.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the inclusion of the above copyright notice and this permission
notice in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
