const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'csuite_db',
    port: 3306
});

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
