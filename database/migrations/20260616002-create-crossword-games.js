'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crossword_games', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
      },
      time_seconds: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      played_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('crossword_games', ['difficulty']);
    await queryInterface.addIndex('crossword_games', ['played_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crossword_games');
  },
};
