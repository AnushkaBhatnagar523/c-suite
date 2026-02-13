require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database/db');

const username = 'anushka@gmail.com';
const password = 'admin123';

bcrypt.hash(password, 10, function (err, hashedPassword) {
    if (err) {
        console.error('Bcrypt error:', err);
        return;
    }

    // Using the db wrapper which handles PG connection
    // Note: PostgreSQL equivalent of INSERT OR IGNORE is ON CONFLICT DO NOTHING
    const sql = 'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?) ON CONFLICT (username) DO NOTHING';

    db.run(
        sql,
        [username, hashedPassword, 'admin'],
        function (err) {
            if (err) {
                console.error('❌ Database error:', err.message);
            } else {
                console.log(`✅ Default admin ensures: ${username} / ${password}`);
            }
            // Give it a second to finish then exit
            setTimeout(() => process.exit(0), 1000);
        }
    );
});
