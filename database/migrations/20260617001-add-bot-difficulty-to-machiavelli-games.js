'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // defaultValue per non rompere eventuali righe già presenti; le nuove
    // partite passano sempre bot_difficulty esplicito dal client.
    await queryInterface.addColumn('machiavelli_games', 'bot_difficulty', {
      type: Sequelize.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'medium',
    });

    await queryInterface.addIndex('machiavelli_games', ['bot_difficulty']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('machiavelli_games', 'bot_difficulty');
  },
};
