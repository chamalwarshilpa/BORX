const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceDaily: DataTypes.FLOAT,
  depositAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  city: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'paused', 'deleted'),
    defaultValue: 'active',
  },
}, {
  tableName: 'listings',
  timestamps: true,
});

Listing.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = Listing;