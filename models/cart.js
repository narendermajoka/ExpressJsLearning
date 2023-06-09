const Sequelize = require('sequelize');

const sequlize = require('../utils/database');

const Cart = sequlize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;