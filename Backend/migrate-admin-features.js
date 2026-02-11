require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL is required for Supabase, but sometimes local dev or specific poolers might reject it if not configured right.
    // Try disable if error persists, or stricter. For now, let's try { rejectUnauthorized: false } which is standard.
    // Wait, the error was "The server does not support SSL connections". This usually happens with local DBs or some proxies.
    // Let's try removing SSL config if the URL is local, or assume it's external.
    // Given the confirmed Vercel env, let's try connecting without explicit SSL first if URL mode requires it.
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Running migration...');

        // Add experience_months column
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS experience_months INTEGER DEFAULT 0;
        `);

        console.log('Added experience_months column.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
