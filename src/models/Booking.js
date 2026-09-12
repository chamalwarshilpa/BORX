const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  listingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Listing, key: 'id' },
  },
  renterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalPrice: DataTypes.FLOAT,
  depositAmount: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'bookings',
  timestamps: true,
});

Booking.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
Booking.belongsTo(User, { foreignKey: 'renterId', as: 'renter' });

module.exports = Booking;