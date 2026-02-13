const db = require('./database/db');

async function checkSchema() {
    console.log('--- Checking Blogs Table Schema ---');
    // For SQLite
    db.all('PRAGMA table_info(blogs)', [], (err, rows) => {
        if (err) {
            console.log('PostgreSQL detected or error:', err.message);
            // For PostgreSQL
            db.all("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'blogs'", [], (err2, rows2) => {
                if (err2) {
                    console.error('Error:', err2.message);
                } else {
                    console.log('PG Columns:', rows2);
                }
                process.exit(0);
            });
        } else {
            console.log('SQLite Columns:', rows);
            process.exit(0);
        }
    });
}

setTimeout(checkSchema, 2000);
