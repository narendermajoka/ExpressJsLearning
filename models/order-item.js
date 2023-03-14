const Sequelize = require('sequelize');

const sequlize = require('../utils/database');

const OrderItem = sequlize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity : Sequelize.INTEGER
});

module.exports = OrderItem;