require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const init = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await client.query(schema);
        console.log('Database schema applied successfully');

        // Create uploads directory if not exists
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
            console.log('Created uploads directory');
        }

    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await client.end();
    }
};

init();
