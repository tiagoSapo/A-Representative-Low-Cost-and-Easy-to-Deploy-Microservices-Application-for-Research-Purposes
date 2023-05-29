const { BIGINT, DATE, BOOLEAN } = require('sequelize');
const sequelize = require('../config/database');
const Store = require('./store');

const Subscription = sequelize.define('Subscription', {
    expirationDate: {
        type: DATE,
        allowNull: false
    },
    active: {
        type: BOOLEAN,
        allowNull: false
    }
});

// Define the one-to-many relationship between Store and Subscription
//Store.hasMany(Subscription);

// Define the one-to-one relationship between Store and Subscription
Store.hasOne(Subscription);
Subscription.belongsTo(Store);

module.exports = Subscription;
