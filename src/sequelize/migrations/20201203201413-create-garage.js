'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('garage', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        unique: 'fkUserId_fkCarId_unique',
        allowNull: false,
      },
      fkCarId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'fkUserId_fkCarId_unique',
        references: {
          model: {
            tableName: 'cars',
            key: 'id',
          },
        },
        onDelete: 'CASCADE',
      }
    },{
      uniqueKeys: {
        fkUserId_fkCarId_unique: {
          customIndex: true,
          fields: ['fkCarId', 'fkUserId'],
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('garage');
  }
};