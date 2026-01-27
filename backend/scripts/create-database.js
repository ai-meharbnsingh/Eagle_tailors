import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function createDatabase() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           Eagle Tailors - Database Setup                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log();

  // Connect to postgres database to create eagle_tailors
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`User: ${process.env.DB_USER || 'postgres'}`);
    console.log();

    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    console.log();

    // Check if database exists
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = 'eagle_tailors'`
    );

    if (checkDb.rows.length > 0) {
      console.log('ℹ️  Database "eagle_tailors" already exists.');
      console.log();
      console.log('Next step: Run migrations');
      console.log('Command: node scripts/migrate.js');
    } else {
      console.log('Creating database "eagle_tailors"...');
      await client.query('CREATE DATABASE eagle_tailors');
      console.log('✅ Database "eagle_tailors" created successfully!');
      console.log();
      console.log('Next step: Run migrations');
      console.log('Command: node scripts/migrate.js');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log();

    if (error.message.includes('password authentication failed')) {
      console.log('⚠️  Password authentication failed!');
      console.log();
      console.log('Please update the password in: backend/.env');
      console.log('Edit the line: DB_PASSWORD=your_actual_password');
      console.log();
      console.log('Your PostgreSQL password is the one you set during installation.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('⚠️  Cannot connect to PostgreSQL!');
      console.log();
      console.log('Make sure PostgreSQL is running:');
      console.log('1. Open Services (services.msc)');
      console.log('2. Find "postgresql-x64-XX" service');
      console.log('3. Start the service if it\'s stopped');
    } else {
      console.log('Unexpected error. Details above.');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
