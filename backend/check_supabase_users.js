const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: "postgresql://postgres:Anushka_CSuite_2026%21@db.doccrivrvhilboodzcin.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
    console.log('--- CHECKING ADMIN USERS IN SUPABASE ---');
    try {
        const res = await pool.query('SELECT username, id FROM admin_users');
        console.log('Users found:', res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
