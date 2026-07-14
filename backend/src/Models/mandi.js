import { DataTypes } from "sequelize";
import { sequelize } from "../Config/db.js";

const Mandi = sequelize.define(
  "Mandi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "Mandis",
    timestamps: true,
  }
);

export default Mandi;
