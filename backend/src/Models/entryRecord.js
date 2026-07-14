
import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.js';

const EntryRecord = sequelize.define('EntryRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  mandiId: { type: DataTypes.UUID, allowNull: false },
  shopId: { type: DataTypes.UUID, allowNull: false },
  farmerId: { type: DataTypes.UUID, allowNull: false },
  cropId: { type: DataTypes.UUID, allowNull: false },

  quantity: { type: DataTypes.INTEGER, allowNull: false },

  rate: { type: DataTypes.FLOAT, allowNull: true },

  soldStatus: {
    type: DataTypes.ENUM('notsold', 'sold'),
    defaultValue: 'notsold'
  },

  transactionStatus: {
    type: DataTypes.ENUM('done', 'notdone'),
    defaultValue: 'notdone'
  },

  date: { type: DataTypes.DATEONLY, allowNull: false }

}, {
  tableName: 'EntryRecords',
  timestamps: true,
  indexes: [
    { fields: ['mandiId'] },
    { fields: ['shopId'] },
    { fields: ['farmerId'] },
    { fields: ['cropId'] },
    { fields: ['date'] },
    { fields: ['shopId', 'date'] }
  ]
});

export default EntryRecord;
