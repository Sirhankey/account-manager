'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
 id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING(128),
        allowNull: false,
        field: 'name'
    },
    total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'amount'
    },
    vencimento: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'dueDate'
    },
    pago: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'isPaid'
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'groups',
            key: 'id'
        }
    },
    statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'status',
            key: 'id'
        }
    },
    paymentMethodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'paymentMethods',
            key: 'id'
        }
    },
    paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};