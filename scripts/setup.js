'use strict';

require('dotenv').config();
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function main() {
  // 1. Crea DB con le credenziali dell'utente (non root)
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
  console.log(`✓ Database '${DB_NAME}' pronto`);

  // 2. Migrazioni
  execSync('npx sequelize db:migrate', { stdio: 'inherit' });
  console.log('✓ Migrazioni completate');

  // 3. Pre-generazione puzzle cruciverba
  execSync('node scripts/build-puzzles.js', { stdio: 'inherit' });
  console.log('✓ Puzzle pre-generati');
}

main().catch((err) => {
  console.error('\nSetup fallito:', err.message);
  process.exit(1);
});
