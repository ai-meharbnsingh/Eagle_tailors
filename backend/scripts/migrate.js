import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function runMigrations() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    const migrationPath = path.join(__dirname, '../../database/migrations/001_initial_schema.sql');
    console.log(`Reading migration file: ${migrationPath}`);

    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('\nDatabase schema created with:');
    console.log('  - Users table');
    console.log('  - Customers table');
    console.log('  - Customer phones table');
    console.log('  - Books table');
    console.log('  - Bills table');
    console.log('  - Bill measurements table');
    console.log('  - Garment types table (with default data)');
    console.log('  - Audit log table');
    console.log('  - System settings table');
    console.log('\nYou can now start the application!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.message.includes('already exists')) {
      console.log('\nNote: Some tables already exist. This might be expected if you\'ve run migrations before.');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
