'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(40)
      },
      username: {
        type: Sequelize.STRING(60)
      },
      email: {
        type: Sequelize.STRING(100)
      },
      password: {
        type: Sequelize.STRING(255)
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'roles',
            key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};