const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: "postgresql://postgres:Anushka_CSuite_2026%21@db.doccrivrvhilboodzcin.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});

async function verifyPassword() {
    const username = 'Aaradhya@gmail.com';
    const password = 'Aaradhya123';

    console.log('--- VERIFYING PASSWORD IN SUPABASE ---');
    try {
        const res = await pool.query('SELECT password_hash FROM admin_users WHERE username = $1', [username]);
        if (res.rows.length === 0) {
            console.log('User not found');
            return;
        }
        const hash = res.rows[0].password_hash;
        const isMatch = await bcrypt.compare(password, hash);
        console.log('Password match:', isMatch);
        console.log('Hash:', hash);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

verifyPassword();
