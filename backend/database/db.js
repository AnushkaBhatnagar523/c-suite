const mariadb = require('mariadb');

// Global fix for BigInt serialization (common with MariaDB)
BigInt.prototype.toJSON = function () { return Number(this); };

let activeDb = null;


function getPool() {
    const connectionUri = process.env.MARIADB_URL || process.env.DATABASE_URL;

    if (connectionUri && (connectionUri.startsWith('mariadb://') || connectionUri.startsWith('mysql://'))) {
        const isLocal = connectionUri.includes('127.0.0.1') || connectionUri.includes('localhost');
        console.log(`📡 Using Connection URI (${isLocal ? 'Local' : 'Cloud'})`);

        if (isLocal) {
            // Local URI is simpler, usually no SSL
            return mariadb.createPool(connectionUri);
        } else {
            // For Cloud (Aiven), we need to ensure SSL is enabled if not in URI
            console.log('🔒 Applying Cloud SSL settings...');

            // If the URI is a string, mariadb.createPool(string) works, 
            // but to add SSL object we need the options style
            return mariadb.createPool({
                uri: connectionUri,
                ssl: {
                    rejectUnauthorized: false // Often required for Aiven/Render
                },
                connectionLimit: 10,
                connectTimeout: 15000 // Increase to 15s for cloud
            });
        }
    }

    // Manual Object Setup
    console.log('📂 Using Manual Config Object');
    return mariadb.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'csuite_db',
        port: parseInt(process.env.DB_PORT) || 3306,
        connectionLimit: 10,
        connectTimeout: 10000
    });
}

const pool = getPool();

async function init() {
    console.log('🔄 Initializing MariaDB Database...');

    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MariaDB successfully');

        activeDb = {
            type: 'mariadb',
            all: async (sql, params) => {
                return await conn.query(sql.replace(/\?/g, '?'), params);
            },
            get: async (sql, params) => {
                const rows = await conn.query(sql.replace(/\?/g, '?'), params);
                return rows[0];
            },
            run: async (sql, params) => {
                const res = await conn.query(sql.replace(/\?/g, '?'), params);
                return {
                    lastID: res.insertId,
                    changes: res.affectedRows
                };
            }
        };

        conn.release();
        return true;
    } catch (err) {
        console.error('❌ MariaDB Connection Failed!');
        console.error('Error Trace:', err);
        // Don't exit immediately in development to allow debug, 
        // but in production it helps Render show failure
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        return false;
    }
}

const initPromise = init();

// Wrapper to bridge original callback-style DB calls to MariaDB's Promise-style calls
// Helper to recursively convert BigInt to Number
function convertBigInt(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return Number(obj);
    if (Array.isArray(obj)) return obj.map(convertBigInt);
    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = convertBigInt(obj[key]);
        }
        return newObj;
    }
    return obj;
}

const safeQuery = (method) => (sql, params, cb) => {
    let actualParams = params;
    let actualCb = cb;
    if (typeof params === 'function') {
        actualCb = params;
        actualParams = [];
    }

    initPromise.then(async () => {
        if (!activeDb) return actualCb ? actualCb(new Error('Database not initialized')) : null;

        try {
            if (method === 'all') {
                const rows = await pool.query(sql, actualParams);
                if (actualCb) actualCb(null, convertBigInt(rows));
            } else if (method === 'get') {
                const rows = await pool.query(sql, actualParams);
                if (actualCb) actualCb(null, convertBigInt(rows[0]));
            } else if (method === 'run') {
                let cleanSql = sql.replace(/RETURNING id/gi, '');
                const res = await pool.query(cleanSql, actualParams);
                const ctx = {
                    lastID: typeof res.insertId === 'bigint' ? Number(res.insertId) : res.insertId,
                    changes: typeof res.affectedRows === 'bigint' ? Number(res.affectedRows) : res.affectedRows
                };
                if (actualCb) actualCb.call(ctx, null);
            }
        } catch (err) {
            if (actualCb) actualCb(err);
        }
    }).catch(err => {
        if (actualCb) actualCb(err);
    });
};


module.exports = {
    all: safeQuery('all'),
    get: safeQuery('get'),
    run: safeQuery('run')
};
