const mariadb = require('mariadb');
require('dotenv').config();

const connectionUri = process.env.MARIADB_URL || process.env.DATABASE_URL;
console.log('Testing with direct URI string:', connectionUri);

const pool = mariadb.createPool(connectionUri);

async function test() {
    let conn;
    try {
        console.log('Trying to connect...');
        conn = await pool.getConnection();
        console.log('Connected!');
        const rows = await conn.query("SELECT 1 as val");
        console.log('Query result:', rows);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}

test();
