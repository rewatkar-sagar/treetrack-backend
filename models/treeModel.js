const { Sequelize, DataTypes } = require('sequelize');

// Connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'  // Make sure this file exists
});

// Define the Tree model
const Tree = sequelize.define('Tree', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagePath: {
    type: DataTypes.STRING
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  voucherCode: {
    type: DataTypes.STRING
  }
});

// Sync with database
sequelize.sync();

module.exports = { sequelize, Tree };
