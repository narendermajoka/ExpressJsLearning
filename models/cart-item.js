const Sequelize = require('sequelize');

const sequlize = require('../utils/database');

const CartItem = sequlize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity : Sequelize.INTEGER
});

module.exports = CartItem;