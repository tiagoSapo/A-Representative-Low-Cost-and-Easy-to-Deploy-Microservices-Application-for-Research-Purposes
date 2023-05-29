
const { BIGINT, STRING } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      len: [4, 20] // minimum length is 4 and maximum length is 20
    }
  },
  location: {
    type: STRING
  },
  websiteUrl: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true
    }
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  bankAccount: {
    type: BIGINT,
    allowNull: false
  }
});


module.exports = Store;
