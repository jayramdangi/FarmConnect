// src/Models/associations.js
import { sequelize } from '../Config/db.js';

import MandiModel from './mandi.js';
import ShopModel from './shop.js';
import FarmerModel from './farmer.js';
import CropModel from './crop.js';
import EntryRecordModel from './entryRecord.js';

export const Mandi = MandiModel;
export const Shop = ShopModel;
export const Farmer = FarmerModel;
export const Crop = CropModel;
export const EntryRecord = EntryRecordModel;


Mandi.hasMany(Shop, { foreignKey: 'mandiId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Shop.belongsTo(Mandi, { foreignKey: 'mandiId' });


Shop.hasMany(EntryRecord, { foreignKey: 'shopId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
EntryRecord.belongsTo(Shop, { foreignKey: 'shopId' });


Farmer.hasMany(EntryRecord, { foreignKey: 'farmerId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
EntryRecord.belongsTo(Farmer, { foreignKey: 'farmerId' });


Crop.hasMany(EntryRecord, { foreignKey: 'cropId', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
EntryRecord.belongsTo(Crop, { foreignKey: 'cropId' });


Mandi.hasMany(EntryRecord, { foreignKey: 'mandiId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
EntryRecord.belongsTo(Mandi, { foreignKey: 'mandiId' });

export { sequelize };
