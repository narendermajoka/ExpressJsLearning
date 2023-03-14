const Sequelize = require('sequelize');

const sequlize = require('../utils/database');

const Order = sequlize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;