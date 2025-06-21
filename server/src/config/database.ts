import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'studio_booking',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production',
};

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: 'postgres',
    logging: databaseConfig.logging ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export default databaseConfig;
