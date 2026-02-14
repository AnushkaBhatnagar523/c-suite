require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const sqliteDbPath = path.resolve(__dirname, 'database', 'csuite.db');
const sqliteDb = new sqlite3.Database(sqliteDbPath);

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('Starting migration from SQLite to PostgreSQL...');

    try {
        // Connect to Postgres
        await pgPool.connect();
        console.log('Connected to PostgreSQL');

        // Migrate Blogs
        console.log('Migrating blogs...');
        const blogs = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM blogs', [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const blog of blogs) {
            await pgPool.query(
                'INSERT INTO blogs (id, title, slug, content, category, author, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
                [blog.id, blog.title, blog.slug, blog.content, blog.category, blog.author, blog.status, blog.created_at]
            );
        }

        // Migrate Circulars
        console.log('Migrating circulars...');
        const circulars = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM circulars', [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const c of circulars) {
            await pgPool.query(
                'INSERT INTO circulars (id, title, authority, reference_no, summary, pdf_url, issued_date) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [c.id, c.title, c.authority, c.reference_no, c.summary, c.pdf_url, c.issued_date]
            );
        }

        // Migrate Services
        console.log('Migrating services...');
        const services = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM services', [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const s of services) {
            await pgPool.query(
                'INSERT INTO services (id, service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
                [s.id, s.service_name, s.slug, s.description, s.applicable_acts, s.sub_services, s.meta_title, s.meta_description]
            );
        }

        // Migrate Admin Users
        console.log('Migrating admin users...');
        const users = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM admin_users', [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const u of users) {
            await pgPool.query(
                'INSERT INTO admin_users (id, username, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
                [u.id, u.username, u.password_hash, u.role]
            );
        }

        // Migrate Analytics
        console.log('Migrating analytics...');
        const analytics = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM analytics', [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const a of analytics) {
            await pgPool.query(
                'INSERT INTO analytics (id, page, referrer, user_agent, ip_address, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
                [a.id, a.page, a.referrer, a.user_agent, a.ip_address, a.created_at]
            );
        }

        // Reset sequences for SERIAL columns
        console.log('Resetting sequences...');
        const tables = ['blogs', 'circulars', 'services', 'admin_users', 'analytics'];
        for (const table of tables) {
            await pgPool.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table}`);
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        sqliteDb.close();
        await pgPool.end();
    }
}

migrate();
