const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: "postgresql://postgres:Anushka_CSuite_2026%21@db.doccrivrvhilboodzcin.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});

async function masterReset() {
    const user = 'Aaradhya@gmail.com';
    const pass = 'Aaradhya123';
    const hash = await bcrypt.hash(pass, 10);

    console.log('--- MASTER RESET ON PROD DATABASE ---');
    try {
        // 1. Wipe everything
        const deleteRes = await pool.query('DELETE FROM admin_users');
        console.log('✅ Cleared users. Rows deleted:', deleteRes.rowCount);

        // 2. Insert the specific one
        await pool.query('INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3)', [user, hash, 'admin']);
        console.log('✅ Created admin:', user);

        // 3. Verify exactly what is there
        const res = await pool.query('SELECT id, username, password_hash FROM admin_users');
        console.log('Final DB State:', JSON.stringify(res.rows, null, 2));

        // 4. Test bcrypt one last time on the exact hash we just saved
        if (res.rows.length > 0) {
            const match = await bcrypt.compare(pass, res.rows[0].password_hash);
            console.log('Bcrypt Self-Test Match:', match);
        }

    } catch (err) {
        console.error('❌ Error during reset:', err.message);
    } finally {
        await pool.end();
        console.log('Connection closed.');
    }
}

masterReset();
