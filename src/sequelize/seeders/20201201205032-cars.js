'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('cars', [
      {
        id: 1,
        brand: "BMW",
        model: 'M5',
        year: 2020,
        engine_type: 'Petrol',
        engine_capacity: '5.0'
      },
      {
        id: 2,
        brand: "Mazda",
        model: 'CX-5',
        year: 2020,
        engine_type: 'Petrol',
        engine_capacity: '2.0'
      },
      {
        id: 3,
        brand: "Lada",
        model: 'Kalina',
        year: 2012,
        engine_type: 'Gas',
        engine_capacity: '1.2'
      }
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cars', null, {});
  }
};