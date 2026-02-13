const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    ssl: { rejectUnauthorized: false }
});

async function test() {
    console.log('Testing connection with individual fields...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    try {
        await client.connect();
        console.log('SUCCESS: Connected to PostgreSQL');
        const res = await client.query('SELECT NOW()');
        console.log('QUERY OK:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('FAILURE ERROR:', err);
        process.exit(1);
    }
}

test();
