const mariadb = require('mariadb');

// Global fix for BigInt serialization (common with MariaDB)
BigInt.prototype.toJSON = function () { return Number(this); };

let activeDb = null;


function getPool() {
    const connectionUri = process.env.MARIADB_URL || process.env.DATABASE_URL;

    // If it's a cloud URI (MariaDB or MySQL)
    if (connectionUri && (connectionUri.startsWith('mariadb://') || connectionUri.startsWith('mysql://'))) {
        const isLocal = connectionUri.includes('127.0.0.1') || connectionUri.includes('localhost');

        if (isLocal) {
            return mariadb.createPool(connectionUri);
        } else {
            // For Cloud (Aiven), we might need to append SSL settings if not present
            let finalUri = connectionUri;
            if (!finalUri.includes('ssl-mode=')) {
                finalUri += (finalUri.includes('?') ? '&' : '?') + 'ssl-mode=REQUIRED';
            }
            return mariadb.createPool({
                uri: finalUri,
                ssl: { rejectUnauthorized: false },
                connectionLimit: 10,
                connectTimeout: 10000
            });
        }
    }

    // Fallback to manual config object
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

function init() {
    console.log('🔄 Initializing MariaDB Database...');

    return pool.getConnection()
        .then(conn => {
            console.log('✅ Connected to MariaDB');

            activeDb = {
                type: 'mariadb',
                all: async (sql, params) => {
                    const rows = await conn.query(sql.replace(/\?/g, '?'), params);
                    return rows;
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
        })
        .catch(err => {
            console.error('❌ MariaDB Connection Failed!');
            console.error('Error Details:', err.message || err);
            process.exit(1);
        });
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
