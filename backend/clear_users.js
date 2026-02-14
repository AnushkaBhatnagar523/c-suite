require('dotenv').config();
const db = require('./database/db');

async function clearUsers() {
    console.log('🗑️ Deleting all admin users...');
    db.run('DELETE FROM admin_users', [], (err) => {
        if (err) {
            console.error('❌ Error clearing users:', err.message);
        } else {
            console.log('✅ admin_users table cleared.');
        }
        process.exit(0);
    });
}

// Wait for DB init
setTimeout(clearUsers, 1000);
