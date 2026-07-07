const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn(
      'blogs',
      'year_written',
      'year'
    )
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn(
      'blogs',
      'year',
      'year_written'
    )
  },
}