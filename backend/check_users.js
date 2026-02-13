const db = require('./database/db');

async function checkUsers() {
    console.log('--- Checking Admin Users ---');
    db.all('SELECT id, username, role FROM admin_users', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
        } else {
            console.log('Users found:', rows);
        }
        process.exit(0);
    });
}

setTimeout(checkUsers, 2000);
