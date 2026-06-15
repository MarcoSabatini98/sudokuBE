# 🔢 Sudoku — Backend API

[🇮🇹 Italiano](#-italiano) · [🇬🇧 English](#-english)

---

## 🇮🇹 Italiano

### Descrizione

REST API per il gioco del Sudoku. Genera puzzle con soluzione unica, salva le partite e tiene traccia dei record personali per difficoltà.

**Stack:** Node.js · Express 5 · Sequelize 6 · MariaDB

---

### Prerequisiti

- Node.js 18+
- MariaDB 10.6+ (o MySQL 8+)

---

### Installazione

```bash
# Clona il repository e installa dipendenze
npm install

# Copia e configura le variabili d'ambiente
cp .env.example .env
```

Modifica `.env` con i tuoi dati:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sudoku
DB_USER=sudoku_user
DB_PASSWORD=password_sicura
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

---

### Database

```sql
-- Crea database e utente in MariaDB
CREATE DATABASE sudoku CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sudoku_user'@'localhost' IDENTIFIED BY 'password_sicura';
GRANT ALL PRIVILEGES ON sudoku.* TO 'sudoku_user'@'localhost';
FLUSH PRIVILEGES;
```

Le tabelle vengono create automaticamente all'avvio (Sequelize `sync`).

**Tabelle:**

| Tabella | Descrizione |
|---|---|
| `games` | Partite salvate (puzzle, soluzione, difficoltà, tempo, esito) |
| `records` | Miglior tempo per difficoltà |

---

### Avvio

```bash
# Sviluppo (con auto-reload)
npm run dev

# Produzione
npm start
```

Il server parte su `http://localhost:3000` (o la porta specificata in `PORT`).

---

### Endpoint API

Base URL: `http://localhost:3000/api/v1`

Tutti i response seguono il formato **JSend**:
```json
{ "status": "success", "data": { ... } }
{ "status": "fail",    "fail": { ... } }
{ "status": "error",   "message": "..." }
```

#### Sudoku

| Metodo | Path | Descrizione |
|---|---|---|
| `GET` | `/sudoku/generate` | Genera un nuovo puzzle |

**Query params:**

| Param | Valori | Default |
|---|---|---|
| `difficulty` | `easy` · `medium` · `hard` · `extreme` | `easy` |

**Risposta:**
```json
{
  "status": "success",
  "data": {
    "puzzle":   [[5,3,0,...], ...],
    "solution": [[5,3,4,...], ...]
  }
}
```
`0` = cella vuota. Entrambe sono matrici 9×9.

---

#### Partite

| Metodo | Path | Descrizione |
|---|---|---|
| `POST` | `/games` | Salva una partita |
| `GET`  | `/games` | Lista partite con paginazione |

**POST `/games` — body:**
```json
{
  "difficulty":        "easy",
  "puzzle":            [[...]],
  "solution":          [[...]],
  "time_seconds":      142,
  "completed":         true
}
```

**GET `/games` — query params:**

| Param | Valori | Default |
|---|---|---|
| `difficulty` | `easy` · `medium` · `hard` · `extreme` | (tutti) |
| `page`       | intero ≥ 1 | `1` |
| `limit`      | intero 1–100 | `15` |

**Risposta:**
```json
{
  "status": "success",
  "data": {
    "data": [ { "id": 1, "difficulty": "easy", "time_seconds": 142, ... } ],
    "pagination": { "total": 42, "page": 1, "limit": 15, "totalPages": 3 }
  }
}
```

---

#### Record

| Metodo | Path | Descrizione |
|---|---|---|
| `GET` | `/records` | Migliori tempi per difficoltà |

**Risposta:**
```json
{
  "status": "success",
  "data": [
    {
      "difficulty": "easy",
      "best_time_seconds": 98,
      "best_game": { "played_at": "2024-01-15T10:30:00.000Z" }
    },
    ...
  ]
}
```

---

#### Macchiavelli

Persistenza del gioco di carte Macchiavelli (1 umano vs 3 bot, logica e AI lato frontend).

| Metodo | Path | Descrizione |
|---|---|---|
| `POST` | `/machiavelli` | Salva l'esito di una partita |
| `GET`  | `/machiavelli` | Lista partite con paginazione |
| `GET`  | `/machiavelli/records` | Miglior tempo di vittoria |

**POST `/machiavelli` — body:**
```json
{ "won": true, "duration_seconds": 312 }
```

**GET `/machiavelli/records` — risposta:**
```json
{
  "status": "success",
  "data": {
    "best_time_seconds": 240,
    "best_game": { "id": 5, "won": true, "duration_seconds": 240 }
  }
}
```
`best_time_seconds` è `null` finché non c'è almeno una vittoria.

> Tabella `machiavelli_games` creata dalla migration `20260615001-create-machiavelli-games.js`.

---

### Test

```bash
# Esegui tutti i test
npm test

# Con coverage
npm run test:coverage
```

**Suite di test:**

| File | Cosa testa |
|---|---|
| `sudoku.service.test.js` | Generazione puzzle per tutte le difficoltà, struttura 9×9, celle iniziali corrette, errore per difficoltà invalida |
| `game.service.test.js` | Salvataggio partita con/senza record, rollback transazione su errore |
| `record.repository.test.js` | Creazione record, aggiornamento solo se tempo migliore |
| `sudoku.routes.test.js` | Endpoint HTTP: risposta 200 con puzzle, 400 per difficoltà invalida |

---

### Lint

```bash
npm run lint
```

Configurazione: ESLint 9 flat config (`eslint.config.js`) con regole `@eslint/js` + `globals.node`.

---

### Struttura cartelle

```
sudokuBE/
├── src/
│   ├── config/          # Configurazione Sequelize
│   ├── constants/       # Costanti (difficoltà, celle)
│   ├── controllers/     # Handler delle route
│   ├── errors/          # AppError custom
│   ├── middleware/       # Validazione request
│   ├── models/          # Modelli Sequelize (Game, Record)
│   ├── repositories/    # Accesso dati
│   ├── routes/          # Definizione route Express
│   ├── services/        # Business logic (sudoku, game)
│   └── utils/           # Logger, http response helpers
├── __tests__/           # Test Jest + supertest
├── app.js               # Setup Express
├── server.js            # Entry point
├── eslint.config.js
└── jest.config.js
```

---

## 🇬🇧 English

### Description

REST API for the Sudoku game. Generates puzzles with a unique solution, saves games, and tracks personal records per difficulty.

**Stack:** Node.js · Express 5 · Sequelize 6 · MariaDB

---

### Prerequisites

- Node.js 18+
- MariaDB 10.6+ (or MySQL 8+)

---

### Installation

```bash
# Clone the repository and install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sudoku
DB_USER=sudoku_user
DB_PASSWORD=secure_password
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

---

### Database

```sql
-- Create database and user in MariaDB
CREATE DATABASE sudoku CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sudoku_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON sudoku.* TO 'sudoku_user'@'localhost';
FLUSH PRIVILEGES;
```

Tables are created automatically on startup (Sequelize `sync`).

**Tables:**

| Table | Description |
|---|---|
| `games` | Saved games (puzzle, solution, difficulty, time, result) |
| `records` | Best time per difficulty |

---

### Start

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:3000` (or the port set in `PORT`).

---

### API Endpoints

Base URL: `http://localhost:3000/api/v1`

All responses follow the **JSend** format:
```json
{ "status": "success", "data": { ... } }
{ "status": "fail",    "fail": { ... } }
{ "status": "error",   "message": "..." }
```

#### Sudoku

| Method | Path | Description |
|---|---|---|
| `GET` | `/sudoku/generate` | Generate a new puzzle |

**Query params:**

| Param | Values | Default |
|---|---|---|
| `difficulty` | `easy` · `medium` · `hard` · `extreme` | `easy` |

**Response:**
```json
{
  "status": "success",
  "data": {
    "puzzle":   [[5,3,0,...], ...],
    "solution": [[5,3,4,...], ...]
  }
}
```
`0` = empty cell. Both are 9×9 matrices.

---

#### Games

| Method | Path | Description |
|---|---|---|
| `POST` | `/games` | Save a game |
| `GET`  | `/games` | List games with pagination |

**POST `/games` — body:**
```json
{
  "difficulty":    "easy",
  "puzzle":        [[...]],
  "solution":      [[...]],
  "time_seconds":  142,
  "completed":     true
}
```

**GET `/games` — query params:**

| Param | Values | Default |
|---|---|---|
| `difficulty` | `easy` · `medium` · `hard` · `extreme` | (all) |
| `page`       | integer ≥ 1 | `1` |
| `limit`      | integer 1–100 | `15` |

**Response:**
```json
{
  "status": "success",
  "data": {
    "data": [ { "id": 1, "difficulty": "easy", "time_seconds": 142, ... } ],
    "pagination": { "total": 42, "page": 1, "limit": 15, "totalPages": 3 }
  }
}
```

---

#### Records

| Method | Path | Description |
|---|---|---|
| `GET` | `/records` | Best times per difficulty |

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "difficulty": "easy",
      "best_time_seconds": 98,
      "best_game": { "played_at": "2024-01-15T10:30:00.000Z" }
    },
    ...
  ]
}
```

---

#### Macchiavelli

Persistence for the Macchiavelli card game (1 human vs 3 bots, logic and AI on the frontend).

| Method | Path | Description |
|---|---|---|
| `POST` | `/machiavelli` | Save a game result |
| `GET`  | `/machiavelli` | List games with pagination |
| `GET`  | `/machiavelli/records` | Best winning time |

**POST `/machiavelli` — body:**
```json
{ "won": true, "duration_seconds": 312 }
```

**GET `/machiavelli/records` — response:**
```json
{
  "status": "success",
  "data": {
    "best_time_seconds": 240,
    "best_game": { "id": 5, "won": true, "duration_seconds": 240 }
  }
}
```
`best_time_seconds` is `null` until there is at least one win.

> Table `machiavelli_games` created by migration `20260615001-create-machiavelli-games.js`.

---

### Tests

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage
```

**Test suites:**

| File | What it tests |
|---|---|
| `sudoku.service.test.js` | Puzzle generation for all difficulties, 9×9 structure, correct initial cell counts, error for invalid difficulty |
| `game.service.test.js` | Game saving with/without record, transaction rollback on error |
| `record.repository.test.js` | Record creation, update only when time is better |
| `sudoku.routes.test.js` | HTTP endpoints: 200 with puzzle, 400 for invalid difficulty |

---

### Lint

```bash
npm run lint
```

Config: ESLint 9 flat config (`eslint.config.js`) with `@eslint/js` rules + `globals.node`.

---

### Folder structure

```
sudokuBE/
├── src/
│   ├── config/          # Sequelize configuration
│   ├── constants/       # Constants (difficulties, cell counts)
│   ├── controllers/     # Route handlers
│   ├── errors/          # Custom AppError
│   ├── middleware/       # Request validation
│   ├── models/          # Sequelize models (Game, Record)
│   ├── repositories/    # Data access layer
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (sudoku, game)
│   └── utils/           # Logger, http response helpers
├── __tests__/           # Jest + supertest tests
├── app.js               # Express setup
├── server.js            # Entry point
├── eslint.config.js
└── jest.config.js
```
