const { BIGINT, STRING, NOW, DATE } = require('sequelize');
const sequelize = require('../config/database');


const AdminNotification = sequelize.define('AdminNotification', {
  title: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,
    allowNull: false
  },
  date: {
    type: DATE,
    defaultValue: NOW
  },
  operation_type: {
    type: STRING,
    allowNull: false
  },
});

module.exports = AdminNotification;
