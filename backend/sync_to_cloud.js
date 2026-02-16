const mariadb = require('mariadb');
require('dotenv').config();

// PRODUCTION CLOUD DATABASE (Aiven)
const cloudUri = process.env.DATABASE_URL || process.env.MARIADB_URL;

// LOCAL DATABASE
const localConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'csuite_db',
    port: 3306
};

async function sync() {
    console.log('🚀 Starting Cloud Sync...');

    let localConn, cloudConn;

    try {
        console.log('📡 Connecting to Local MariaDB...');
        localConn = await mariadb.createConnection(localConfig);

        console.log('☁️ Connecting to Aiven Cloud Database...');
        // Parse cloud URI for robust connection
        const url = new URL(cloudUri);
        cloudConn = await mariadb.createConnection({
            host: url.hostname,
            port: parseInt(url.port) || 3306,
            user: url.username,
            password: decodeURIComponent(url.password),
            database: url.pathname.slice(1),
            ssl: { rejectUnauthorized: false }
        });

        const tables = ['admin_users', 'blogs', 'circulars', 'services'];

        for (const table of tables) {
            console.log(`📦 Syncing table: ${table}...`);

            // 1. Get data from local
            const rows = await localConn.query(`SELECT * FROM ${table}`);

            // 2. Clear cloud table and recreate (Basic approach)
            // Note: In a real app we'd use migrations, but for initial setup this is safest
            const createTableMatch = await localConn.query(`SHOW CREATE TABLE ${table}`);
            let createSql = createTableMatch[0]['Create Table'];

            // Fix collation incompatibility (Happens when local MariaDB is a newer version than Cloud)
            createSql = createSql.replace(/COLLATE=\w+/g, '');
            createSql = createSql.replace(/CHARACTER SET \w+/g, '');

            // Fix "TEXT can't have default value" for older MySQL/MariaDB versions
            createSql = createSql.replace(/`(\w+)` text DEFAULT '([^']+)'/gi, '`$1` varchar(255) DEFAULT \'$2\'');

            await cloudConn.query(`DROP TABLE IF EXISTS ${table}`);
            await cloudConn.query(createSql);

            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const placeholders = columns.map(() => '?').join(',');
                const insertSql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

                for (const row of rows) {
                    const values = columns.map(col => row[col]);
                    await cloudConn.query(insertSql, values);
                }
                console.log(`✅ Synced ${rows.length} rows for ${table}`);
            } else {
                console.log(`ℹ️ Table ${table} is empty, created schema only.`);
            }
        }

        console.log('\n✨ ALL DATA SYNCED TO CLOUD SUCCESSFULLY!');
        console.log('Your website is now ready for world-wide use.');

    } catch (err) {
        console.error('\n❌ Sync Failed!');
        console.error(err);
    } finally {
        if (localConn) localConn.end();
        if (cloudConn) cloudConn.end();
        process.exit();
    }
}

sync();
