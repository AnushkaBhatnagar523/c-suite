const db = require('./database/db');

async function dumpAdmins() {
    console.log('--- ADMIN USERS DUMP ---');
    db.all('SELECT * FROM admin_users', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
        } else {
            console.log(JSON.stringify(rows, null, 2));
        }
        process.exit(0);
    });
}

setTimeout(dumpAdmins, 2000);
