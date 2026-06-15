'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('machiavelli_games', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      won: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      duration_seconds: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      played_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('machiavelli_games', ['won']);
    await queryInterface.addIndex('machiavelli_games', ['played_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('machiavelli_games');
  },
};
