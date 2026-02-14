const { Pool } = require('pg');

let activeDb = null;

// PostgreSQL Configuration Helper
function getPgConfig() {
    if (process.env.DATABASE_URL) {
        // Create a config that forces SSL off but uses the connection string
        return {
            connectionString: process.env.DATABASE_URL.split('?')[0], // Strip existing params to avoid conflicts
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 10000
        };
    }

    return {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    };
}

// Helper: Convert SQLite '?' to PG '$n'
function convertSql(sql) {
    if (!sql) return sql;
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
}

function init() {
    console.log('🔄 Initializing PostgreSQL Database...');

    const config = getPgConfig();

    // Log configuration status (safely)
    if (process.env.DATABASE_URL) {
        console.log('📡 Using DATABASE_URL connection');
    } else {
        console.log(`📡 Connecting to ${config.host}:${config.port} as ${config.user}`);
    }

    const pool = new Pool(config);

    return pool.query('SELECT 1')
        .then(function () {
            console.log('✅ Connected to PostgreSQL');

            activeDb = {
                type: 'pg',
                all: (sql, params, cb) => pool.query(convertSql(sql), params, (err, res) => cb(err, res ? res.rows : null)),
                get: (sql, params, cb) => pool.query(convertSql(sql), params, (err, res) => cb(err, res ? res.rows[0] : null)),
                run: function (sql, params, cb) {
                    let finalSql = convertSql(sql);
                    if (finalSql.trim().toUpperCase().startsWith('INSERT INTO') && !finalSql.toUpperCase().includes('RETURNING')) {
                        finalSql += ' RETURNING id';
                    }
                    pool.query(finalSql, params, (err, res) => {
                        const ctx = {
                            lastID: (res && res.rows[0]) ? res.rows[0].id : null,
                            changes: res ? res.rowCount : 0
                        };
                        if (cb) cb.call(ctx, err);
                    });
                }
            };

            // Init tables
            const tables = [
                `CREATE TABLE IF NOT EXISTS blogs (id SERIAL PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, content TEXT NOT NULL, image_url TEXT, category TEXT, author TEXT, status TEXT DEFAULT 'draft', created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)`,
                `CREATE TABLE IF NOT EXISTS circulars (id SERIAL PRIMARY KEY, title TEXT NOT NULL, authority TEXT, reference_no TEXT, summary TEXT, pdf_url TEXT, issued_date TEXT)`,
                `CREATE TABLE IF NOT EXISTS services (id SERIAL PRIMARY KEY, service_name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, applicable_acts TEXT, sub_services TEXT, meta_title TEXT, meta_description TEXT)`,
                `CREATE TABLE IF NOT EXISTS admin_users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'admin')`,
                `CREATE TABLE IF NOT EXISTS analytics (id SERIAL PRIMARY KEY, page TEXT NOT NULL, referrer TEXT, user_agent TEXT, ip_address TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)`
            ];

            let p = Promise.resolve();
            tables.forEach(q => {
                p = p.then(() => pool.query(q));
            });
            return p;
        })
        .catch(function (err) {
            console.error('❌ PostgreSQL Connection Failed!');
            console.error('Error Details:', err.message || err);
            if (err.code) console.error('Error Code:', err.code);
            console.error('Environment check:');
            console.error('- DATABASE_URL present:', !!process.env.DATABASE_URL);
            console.error('- DB_HOST present:', !!process.env.DB_HOST);

            process.exit(1);
        });
}

// Immediate init call
const initPromise = init();

// Wrapper to ensure db is initialized before running query
const safeQuery = (method) => (sql, params, cb) => {
    // Handle optional params
    let actualParams = params;
    let actualCb = cb;
    if (typeof params === 'function') {
        actualCb = params;
        actualParams = [];
    }

    initPromise.then(() => {
        if (!activeDb) return actualCb(new Error('Database not initialized'));
        activeDb[method](sql, actualParams || [], actualCb);
    }).catch(err => {
        if (actualCb) actualCb(err);
    });
};

module.exports = {
    all: safeQuery('all'),
    get: safeQuery('get'),
    run: safeQuery('run')
};
