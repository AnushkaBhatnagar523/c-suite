const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'csuite.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking for image_url column...');

db.all('PRAGMA table_info(blogs)', (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }

    const hasImageColumn = rows.some(row => row.name === 'image_url');

    if (!hasImageColumn) {
        console.log('Adding image_url column to blogs table...');
        db.run('ALTER TABLE blogs ADD COLUMN image_url TEXT', (err) => {
            if (err) {
                console.error('Error adding column:', err.message);
            } else {
                console.log('✅ Successfully added image_url column');
            }
            db.close();
        });
    } else {
        console.log('✅ image_url column already exists');
        db.close();
    }
});
