const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json'); // Ensure this is correct

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect
  }
);

// Load models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
