const { BIGINT, STRING, NOW, DATE } = require('sequelize');
const sequelize = require('../config/database');

const NormalNotification = sequelize.define('NormalNotification', {
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
  customer_id: {
    type: BIGINT,
    validate: {
      customValidator(value) {
        if (value && this.store_id) {
          throw new Error('Only one of customer_id or store_id can be specified');
        }
      }
    }
  },
  store_id: {
    type: BIGINT,
    validate: {
      customValidator(value) {
        if (value && this.customer_id) {
          throw new Error('Only one of store_id or customer_id can be specified');
        }
      }
    }
  }
});

module.exports = NormalNotification;
