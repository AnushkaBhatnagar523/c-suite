const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const db = require('./database/db');

const email = 'Csuite@gmail.com';
const password = 'Csuite123';

async function resetAdmin() {
    console.log('🔄 Resetting admin users...');

    bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) {
            console.error('❌ Bcrypt error:', err);
            return;
        }

        // Use a transaction-like sequence
        db.run('DELETE FROM admin_users', [], function (err) {
            if (err) {
                console.error('❌ Error deleting old admins:', err.message);
                return;
            }
            console.log('✅ Cleared old admin users.');

            db.run(
                'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
                [email, hashedPassword, 'admin'],
                function (err) {
                    if (err) {
                        console.error('❌ Error creating new admin:', err.message);
                    } else {
                        console.log(`✅ Admin created successfully: ${email}`);
                        console.log(`🔑 Password: ${password}`);
                    }
                    process.exit(0);
                }
            );
        });
    });
}

// Small delay to allow DB init
setTimeout(resetAdmin, 1000);
