import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.js';

const Farmer = sequelize.define('Farmer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: true },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [10, 15], isNumeric: true }
  },
  emailId: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'Farmer',
  timestamps: true
});

export default Farmer;
