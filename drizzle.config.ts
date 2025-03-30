import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.dev' });
}

// Determine the correct host based on environment
const dbHost =
  process.env.NODE_ENV === 'dev' ? 'postgres' : process.env.DB_HOST;

const dbUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${dbHost}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('Using database URL:', dbUrl); // For debugging

export default defineConfig({
  schema: './src/**/schema.ts',
  dialect: 'postgresql',
  out: './drizzle/migrations',
  dbCredentials: {
    url: dbUrl,
  },
});
