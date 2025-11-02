import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema',
  out: './migrations',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    ssl: false,
  },
});
