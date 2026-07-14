
import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.js';

const Crop = sequelize.define('Crop', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'Crops',
  timestamps: true
});

export default Crop;
