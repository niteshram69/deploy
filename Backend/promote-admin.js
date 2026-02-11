require('dotenv').config();
const { Client } = require('pg');

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument.');
    process.exit(1);
}

const run = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('UPDATE users SET role = $1 WHERE email = $2 RETURNING *', ['ADMIN', email]);

        if (res.rows.length === 0) {
            console.log(`User with email ${email} not found.`);
        } else {
            console.log(`User ${email} promoted to ADMIN successfully.`);
            console.table(res.rows);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
};

run();
