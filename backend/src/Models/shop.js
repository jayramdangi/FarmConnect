import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.js';

const Shop = sequelize.define('Shop', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  mandiId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  ownerName: { type: DataTypes.STRING, allowNull: true },
  emailId: { type: DataTypes.STRING, allowNull: true },
  passwordHash: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'Shops',
  timestamps: true,
  indexes: [{ fields: ['mandiId'] }]
});

export default Shop;
