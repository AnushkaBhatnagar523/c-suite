require('dotenv').config();
const db = require('./database/db');

async function dump() {
    console.log('--- ADMIN USERS ---');
    db.all('SELECT * FROM admin_users', [], (err, rows) => {
        if (err) console.error(err);
        else console.log(rows);
        process.exit(0);
    });
}
setTimeout(dump, 2000);
