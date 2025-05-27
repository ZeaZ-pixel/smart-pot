import { DataSource } from 'typeorm';
import 'dotenv/config';
import models from 'src/infrastructure/database/models';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'db',
  entities: [...models],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
