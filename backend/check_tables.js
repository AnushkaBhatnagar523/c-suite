require('dotenv').config();
const db = require('./database/db');

async function checkTables() {
    console.log('--- Checking Supabase Tables ---');
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching tables:', err.message);
        } else {
            console.log('✅ Tables in Database:', rows.map(r => r.table_name));
        }
        process.exit(0);
    });
}

// Wait for DB init
setTimeout(checkTables, 2000);
