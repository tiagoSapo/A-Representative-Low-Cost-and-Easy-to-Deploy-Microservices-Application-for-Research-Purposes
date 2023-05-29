const { BIGINT, STRING } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  /*id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },*/
  name: {
    type: STRING,
    allowNull: false
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      len: [4, 20] // minimum length is 4 and maximum length is 20
    }
  },
});

module.exports = Customer;
