require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database/db');

const admins = [
    // Previous admins removed as per request
];

async function seedAdmins() {
    console.log('🔄 Seeding team admins...');
    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?) ON CONFLICT (username) DO NOTHING',
                [admin.username, hashedPassword, 'admin'],
                function (err) {
                    if (err) {
                        console.error(`❌ Error creating ${admin.username}:`, err.message);
                        reject(err);
                    } else {
                        console.log(`✅ Admin ensured: ${admin.username}`);
                        resolve();
                    }
                }
            );
        });
    }
    console.log('✅ Seeding completed.');
    setTimeout(() => process.exit(0), 1000);
}

seedAdmins();
