const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderReferenceId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  invoiceURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cgst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sgst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  igst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('placed', 'processing', 'shipped', 'delivered'),
    defaultValue: 'placed',
    allowNull: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Order;

