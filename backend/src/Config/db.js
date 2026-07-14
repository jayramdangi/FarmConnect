// src/Config/db.js
import { config as configDotenv } from "dotenv";
configDotenv();

import { Sequelize } from "sequelize";

// named + default export so both import styles work
export const sequelize = new Sequelize(process.env.POSTGRESQL_URL, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
