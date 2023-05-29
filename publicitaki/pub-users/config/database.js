const Sequelize = require('sequelize');

// Replace the values in the following variables with your MySQL database credentials and options
const database = process.env.PUB_USERS_DATABASE_NAME || 'users-db';
const username = process.env.PUB_USERS_DATABASE_USERNAME || 'admin';
const password = process.env.PUB_USERS_DATABASE_PASSWORD || 'admin';
const hostWithPort = process.env.PUB_USERS_DATABASE_HOST || 'pub-users-db:5432';
const [host] = hostWithPort.split(':');
const port = process.env.PUB_USERS_DATABASE_PORT || '5432';

console.log(database);
console.log(username);
console.log(password);
console.log(host);
console.log(port);

// Initialize a new Sequelize instance and connect to the database
const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'postgresql',
  logging: false
});

// Create database
sequelize.sync().then(() => {
  console.log('Tables synced successfully');
});


// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;