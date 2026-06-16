'use strict';

// Mock condivisi per i route test: l'import di `app` non deve aprire connessioni
// reali al DB né definire i modelli Sequelize.

function mockDb() {
  return {
    authenticate: jest.fn().mockResolvedValue(),
    define: jest.fn(),
  };
}

function mockCoreModels() {
  return {
    sequelize: { transaction: jest.fn(), authenticate: jest.fn(), random: jest.fn(() => 'RAND()') },
    Game: { findAll: jest.fn(), create: jest.fn(), hasOne: jest.fn() },
    Record: { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn(), belongsTo: jest.fn() },
    CrosswordGame: { findAll: jest.fn(), count: jest.fn(), create: jest.fn() },
    CrosswordPuzzle: {
      findOne: jest.fn(),
      count: jest.fn(),
      bulkCreate: jest.fn(),
      destroy: jest.fn(),
    },
  };
}

module.exports = { mockDb, mockCoreModels };
